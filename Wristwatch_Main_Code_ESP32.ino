/*
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SwastyaSeva HMS — ESP32 Wristband Sensor v3                     ║
 * ║  6 Vitals: HR · SpO2 · BP · Temperature · Fatigue · WiFi send   ║
 * ║  OLED: 5 rotating pages (HR / SpO2 / Temp / BP / Fatigue)       ║
 * ║  Buzzer: passive, LEDC-driven, alerts on critical vitals         ║
 * ║  Posts to Railway backend via HTTPS every 5 seconds             ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "MAX30105.h"
#include "heartRate.h"
#include "spo2_algorithm.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

// ════════════════════════════════════════════════════════════
//  CONFIGURATION — edit only these lines
// ════════════════════════════════════════════════════════════
const char* WIFI_SSID     = "Redmi Note 9 Pro";
const char* WIFI_PASSWORD = "classroom@123";

const char* SERVER_HOST = "lenten-august-arboresque.ngrok-free.dev";
const char* PATIENT_ID  = "SW-4821";   // updated to new SW-XXXX format

#define SEND_INTERVAL     5000           // send every 5 seconds

// ════════════════════════════════════════════════════════════
//  HARDWARE PINS
// ════════════════════════════════════════════════════════════
#define OLED_RESET   -1
#define BUZZER_PIN    9
#define BUTTON_PIN    8
#define I2C_SDA       6
#define I2C_SCL       7

// ════════════════════════════════════════════════════════════
//  SENSOR CONFIG
// ════════════════════════════════════════════════════════════
#define IR_FINGER_ON      35000UL
#define IR_FINGER_OFF     25000UL
#define RATE_SIZE         8
#define BPM_MIN           45
#define BPM_MAX           175
#define EMA_ALPHA         0.35f
#define SPO2_BUF          50
#define SPO2_UPDATE_MS    2500
#define PAGE_DURATION     3500
#define BEAT_FLASH_MS     180

// ════════════════════════════════════════════════════════════
//  BUZZER
// ════════════════════════════════════════════════════════════
#define BUZZER_FREQ       2500
#define BUZZER_RES        8
#define BUZZER_DUTY_ON    200
#define BUZZER_DUTY_OFF   0
#define BEEP_ON_CRIT      150
#define BEEP_OFF_CRIT     150
#define BEEP_ON_MAN       300
#define BEEP_OFF_MAN      400
#define BTN_DEBOUNCE_MS   50

// ════════════════════════════════════════════════════════════
//  ALARM THRESHOLDS
// ════════════════════════════════════════════════════════════
#define ALARM_BPM_HIGH    120
#define ALARM_BPM_LOW      45
#define ALARM_SPO2_LOW     90
#define ALARM_SYS_HIGH    140
#define ALARM_DIA_HIGH     90
#define ALARM_TEMP_WARN   375   // 37.5 °C × 10
#define ALARM_TEMP_CRIT   385   // 38.5 °C × 10

// ════════════════════════════════════════════════════════════
//  SIMULATED TEMPERATURE (replace getSimulatedTempC with real
//  sensor read when you add DS18B20 / MAX30205 etc.)
// ════════════════════════════════════════════════════════════
#define TEMP_BASE_C       36.6f
#define TEMP_DRIFT_SLOW   0.35f
#define TEMP_DRIFT_FAST   0.15f
#define TEMP_PERIOD_SLOW  120000UL
#define TEMP_PERIOD_FAST   18000UL

float getSimulatedTempC() {
  unsigned long t = millis();
  float slow = TEMP_DRIFT_SLOW * sinf(TWO_PI * t / (float)TEMP_PERIOD_SLOW);
  float fast = TEMP_DRIFT_FAST * sinf(TWO_PI * t / (float)TEMP_PERIOD_FAST);
  return constrain(TEMP_BASE_C + slow + fast, 35.0f, 40.0f);
}

// ════════════════════════════════════════════════════════════
//  FATIGUE INDEX ALGORITHM 
//
//  Fatigue = weighted combo of:
//    - HRV proxy: how much HR varies beat-to-beat (higher = more rested)
//    - HR relative to resting: elevated HR = more fatigue
//    - SpO2: low SpO2 = more fatigue
//    - Time-of-day sine wave: natural afternoon dip
//
// ════════════════════════════════════════════════════════════
#define FATIGUE_MIN  15
#define FATIGUE_MAX  65

float hrHistory[RATE_SIZE];
byte  hrHistIdx = 0;
byte  hrHistCnt = 0;

void recordHRForFatigue(float hr) {
  hrHistory[hrHistIdx % RATE_SIZE] = hr;
  hrHistIdx++;
  if (hrHistCnt < RATE_SIZE) hrHistCnt++;
}

int computeFatigue(float hr, int spo2Val, bool spo2ok) {
  if (hr < 1.0f) return 30; // no reading yet → comfortable default

  // 1. HRV proxy: std-dev of recent HR readings
  float sum = 0, sqSum = 0;
  for (byte i = 0; i < hrHistCnt; i++) { sum += hrHistory[i]; sqSum += hrHistory[i]*hrHistory[i]; }
  float mean = sum / hrHistCnt;
  float variance = (sqSum / hrHistCnt) - (mean * mean);
  float stddev = sqrtf(max(variance, 0.0f));
  // Low HRV → more fatigue. stddev typically 2–8 during rest, <2 when stressed
  float hrvScore = constrain((stddev - 1.5f) / 6.0f * 30.0f, 0.0f, 30.0f); // 0=tired, 30=rested

  // 2. HR elevation above resting (72 BPM baseline)
  float hrElev = constrain((hr - 72.0f) / 40.0f * 25.0f, 0.0f, 25.0f); // elevated HR → tired

  // 3. SpO2 contribution
  float spo2Score = 0;
  if (spo2ok && spo2Val > 0) spo2Score = constrain((100.0f - spo2Val) / 5.0f * 10.0f, 0.0f, 10.0f);

  // 4. Natural circadian dip: afternoon 14:00–16:00 adds 5–10 points
  // Since we don't have RTC, use millis() cycle as proxy (12h cycle)
  unsigned long t = millis();
  float circadian = 5.0f * sinf(TWO_PI * (float)(t % 43200000UL) / 43200000.0f + 1.5f);
  circadian = constrain(circadian, 0.0f, 8.0f);

  // Combine: high hrElev + low HRV + low SpO2 = more fatigue
  float raw = (hrElev + spo2Score + circadian) - (hrvScore * 0.4f) + 25.0f;
  int fatigue = (int)constrain(raw, (float)FATIGUE_MIN, (float)FATIGUE_MAX);
  return fatigue;
}

// ════════════════════════════════════════════════════════════
//  OBJECTS & GLOBALS
// ════════════════════════════════════════════════════════════
Adafruit_SSD1306 display(128, 64, &Wire, OLED_RESET);
MAX30105 particleSensor;

bool fingerPresent = false;
bool prevFinger    = false;

byte  rates[RATE_SIZE];
byte  rateSpot     = 0;
byte  rateCount    = 0;
long  lastBeat     = 0;
bool  firstBeat    = true;
float filteredBPM  = 0.0f;
int   avgBPM       = 0;
unsigned long lastBeatTime = 0;

uint32_t irBuf[SPO2_BUF];
uint32_t redBuf[SPO2_BUF];
byte     spo2Idx        = 0;
bool     spo2Ready      = false;
int32_t  spo2           = 0;
int8_t   spo2Valid      = 0;
unsigned long lastSpo2Update = 0;

float sysBP = 0.0f, diaBP = 0.0f;

float currentTempC = TEMP_BASE_C;
unsigned long lastTempUpdate = 0;

int currentFatigue = 30;

byte          page           = 0;
unsigned long lastPageSwitch = 0;
unsigned long lastPrint      = 0;
unsigned long lastSend       = 0;
unsigned long lastSendTime   = 0;
bool          lastSendOK     = false;

bool          alarmActive    = false;
bool          alarmManual    = false;
bool          alarmCritical  = false;
bool          buzzerState    = false;
unsigned long lastBeepEdge   = 0;
unsigned long beepOnTime     = 0;
unsigned long beepOffTime    = 0;

bool          prevBtnRaw     = HIGH;
unsigned long btnEdgeTime    = 0;

// ════════════════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════════════════
void estimateBP() {
  if (filteredBPM < 1.0f || spo2 < 70) return;
  float pp  = constrain(50.0f - 0.15f*(filteredBPM-70.0f), 25.0f, 60.0f);
  float sys = 118.0f + 0.4f*(filteredBPM-70.0f);
  if (spo2 < 95) sys += (95.0f-spo2)*0.5f;
  sysBP = constrain(sys,       85.0f, 185.0f);
  diaBP = constrain(sys-pp,    55.0f, 115.0f);
}

void resetAllVitals() {
  filteredBPM=0; avgBPM=0; rateSpot=0; rateCount=0;
  firstBeat=true; lastBeat=0; hrHistIdx=0; hrHistCnt=0;
  spo2=0; spo2Valid=0; spo2Idx=0; spo2Ready=false;
  sysBP=0; diaBP=0;
  // temp and fatigue persist
}

// ── WiFi ──────────────────────────────────────────────────
void connectWiFi() {
  Serial.printf("[WiFi] Connecting to %s", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  for (int i=0; i<20 && WiFi.status()!=WL_CONNECTED; i++) { delay(500); Serial.print("."); }
  Serial.println(WiFi.status()==WL_CONNECTED ? "\n[WiFi] Connected!" : "\n[WiFi] Failed");
  if (WiFi.status()==WL_CONNECTED) Serial.printf("[WiFi] IP: %s\n", WiFi.localIP().toString().c_str());
}

// ── Send vitals to Railway backend ────────────────────────
bool sendVitals(int hr, int spO2Val, float sys, float dia, float tempC, int fatigue, bool fingerOn) {
  if (WiFi.status() != WL_CONNECTED) { connectWiFi(); if(WiFi.status()!=WL_CONNECTED) return false; }

  String url = "https://";
  url += SERVER_HOST;
  url += "/api/vitals";

  StaticJsonDocument<320> doc;
  doc["patientId"] = PATIENT_ID;
  doc["finger"]    = fingerOn;
  doc["source"]    = "sensor";
  doc["deviceId"]  = "ESP32-MAX30105-v3";

  if (fingerOn) {
    doc["hr"]      = hr;
    doc["spo2"]    = spO2Val;
    doc["temp"]    = round(tempC * 10.0f) / 10.0f;  // 1 decimal
    doc["fatigue"] = fatigue;
    if (sys > 0 && dia > 0) { doc["sysBP"] = (int)sys; doc["diaBP"] = (int)dia; }
  } else {
    doc["hr"]=0; doc["spo2"]=0; doc["temp"]=0; doc["fatigue"]=0;
  }

  String payload;
  serializeJson(doc, payload);

  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;
  http.begin(client, url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("ngrok-skip-browser-warning", "true");
  http.setTimeout(7000);

  int code = http.POST(payload);
  bool ok = (code==200 || code==201);
  if (ok) {
    if (fingerOn) Serial.printf("[HTTP] OK → HR:%d SpO2:%d%% Temp:%.1fC BP:%d/%d Fatigue:%d\n", hr, spO2Val, tempC, (int)sys, (int)dia, fatigue);
    else Serial.println("[HTTP] OK → No finger (cleared)");
  } else {
    Serial.printf("[HTTP] Failed code=%d\n", code);
  }
  http.end();
  return ok;
}

// ── Buzzer helpers ─────────────────────────────────────────
inline void buzzerOn()  { ledcWrite(BUZZER_PIN, BUZZER_DUTY_ON);  buzzerState=true;  }
inline void buzzerOff() { ledcWrite(BUZZER_PIN, BUZZER_DUTY_OFF); buzzerState=false; }

void startAlarm(bool critical) {
  alarmActive=true; alarmCritical=critical;
  beepOnTime  = critical ? BEEP_ON_CRIT  : BEEP_ON_MAN;
  beepOffTime = critical ? BEEP_OFF_CRIT : BEEP_OFF_MAN;
  buzzerOn(); lastBeepEdge=millis();
}

void stopAlarm() { alarmActive=false; alarmManual=false; alarmCritical=false; buzzerOff(); }

void updateBuzzer(unsigned long now) {
  if (!alarmActive) return;
  unsigned long el = now - lastBeepEdge;
  if (buzzerState  && el >= beepOnTime)  { buzzerOff(); lastBeepEdge=now; }
  if (!buzzerState && el >= beepOffTime) { buzzerOn();  lastBeepEdge=now; }
}

bool vitalsAreCritical() {
  bool bpmBad  = fingerPresent && filteredBPM>0 && ((int)filteredBPM>ALARM_BPM_HIGH || (int)filteredBPM<ALARM_BPM_LOW);
  bool spo2Bad = fingerPresent && spo2Valid && spo2>0 && spo2 < ALARM_SPO2_LOW;
  bool bpBad   = fingerPresent && sysBP>0 && ((int)sysBP>ALARM_SYS_HIGH || (int)diaBP>ALARM_DIA_HIGH);
  bool tempBad = ((int)(currentTempC*10.0f) >= ALARM_TEMP_CRIT);
  return bpmBad || spo2Bad || bpBad || tempBad;
}

bool readButtonPress(unsigned long now) {
  bool raw = digitalRead(BUTTON_PIN);
  bool pressed = false;
  if (prevBtnRaw==HIGH && raw==LOW)  btnEdgeTime = now;
  if (prevBtnRaw==LOW  && raw==HIGH && (now-btnEdgeTime)>=BTN_DEBOUNCE_MS) pressed = true;
  prevBtnRaw = raw;
  return pressed;
}

// ════════════════════════════════════════════════════════════
//  SETUP
// ════════════════════════════════════════════════════════════
void setup() {
  Serial.begin(115200);
  delay(1500);

  ledcAttach(BUZZER_PIN, BUZZER_FREQ, BUZZER_RES);
  ledcWrite(BUZZER_PIN, BUZZER_DUTY_OFF);
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  Wire.begin(I2C_SDA, I2C_SCL);
  Wire.setClock(400000);

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { Serial.println("OLED FAIL"); while(1); }
  display.setTextColor(WHITE);

  // Splash
  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(14, 8);  display.print("SwastyaSeva HMS");
  display.setCursor(10, 22); display.print("Connecting WiFi...");
  display.setCursor(5,  36); display.print(WIFI_SSID);
  display.display();

  connectWiFi();

  display.clearDisplay();
  display.setCursor(14, 8); display.print("SwastyaSeva HMS");
  if (WiFi.status()==WL_CONNECTED) {
    display.setCursor(5, 22);  display.print("WiFi: OK");
    display.setCursor(5, 34);  display.print(WiFi.localIP());
    display.setCursor(5, 46);  display.print("Patient: "); display.print(PATIENT_ID);
  } else {
    display.setCursor(5, 22);  display.print("WiFi: FAILED");
    display.setCursor(5, 34);  display.print("Running offline");
  }
  display.display();
  delay(2000);

  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30105 not found!");
    display.clearDisplay();
    display.setCursor(0,24); display.print("Sensor not found!");
    display.display();
    while(1);
  }
  particleSensor.setup(60, 4, 2, 200, 411, 16384);
  particleSensor.setPulseAmplitudeRed(0x3F);
  particleSensor.setPulseAmplitudeIR(0x3F);

  currentTempC = getSimulatedTempC();
  display.clearDisplay(); display.display();
  Serial.printf("[READY] Patient: %s — Place finger on sensor.\n", PATIENT_ID);
}

// ════════════════════════════════════════════════════════════
//  LOOP
// ════════════════════════════════════════════════════════════
void loop() {
  unsigned long now     = millis();
  long irValue  = particleSensor.getIR();
  long redValue = particleSensor.getRed();

  // ── Button & alarm ──────────────────────────────────────
  if (readButtonPress(now)) {
    if (alarmActive) stopAlarm();
    else { alarmManual=true; startAlarm(false); }
  }
  static bool prevCrit = false;
  bool nowCrit = vitalsAreCritical();
  if (nowCrit && !prevCrit && !alarmActive) startAlarm(true);
  if (alarmActive && alarmCritical && !alarmManual && !nowCrit) stopAlarm();
  prevCrit = nowCrit;
  updateBuzzer(now);

  // ── Finger detection (hysteresis) ───────────────────────
  if (!fingerPresent && irValue > (long)IR_FINGER_ON)  fingerPresent=true;
  if ( fingerPresent && irValue < (long)IR_FINGER_OFF) fingerPresent=false;
  if (prevFinger && !fingerPresent) resetAllVitals();
  prevFinger = fingerPresent;

  // ── BPM ─────────────────────────────────────────────────
  if (fingerPresent) {
    if (checkForBeat(irValue)) {
      long delta = now - lastBeat;
      lastBeat = now; lastBeatTime = now;
      if (firstBeat) { firstBeat=false; }
      else {
        float inst = 60000.0f / (float)delta;
        if (inst > BPM_MIN && inst < BPM_MAX) {
          rates[rateSpot % RATE_SIZE] = (byte)inst;
          rateSpot++; if (rateCount < RATE_SIZE) rateCount++;
          int sum=0; for(byte i=0;i<rateCount;i++) sum+=rates[i];
          avgBPM = sum/rateCount;
          filteredBPM = (filteredBPM<1.0f) ? (float)avgBPM : (1-EMA_ALPHA)*filteredBPM + EMA_ALPHA*(float)avgBPM;
          recordHRForFatigue(filteredBPM);
        }
      }
    }

    // ── SpO2 ──────────────────────────────────────────────
    irBuf[spo2Idx]=(uint32_t)irValue; redBuf[spo2Idx]=(uint32_t)redValue; spo2Idx++;
    if (spo2Idx>=SPO2_BUF) { spo2Idx=0; spo2Ready=true; }
    if (spo2Ready && (now-lastSpo2Update)>=SPO2_UPDATE_MS) {
      lastSpo2Update=now;
      int32_t tHR; int8_t tHRv;
      maxim_heart_rate_and_oxygen_saturation(irBuf,SPO2_BUF,redBuf,&spo2,&spo2Valid,&tHR,&tHRv);
      if (spo2Valid && spo2>70 && spo2<=100) estimateBP();
    }
  }

  // ── Temperature (every second) ──────────────────────────
  if (now - lastTempUpdate >= 1000) {
    lastTempUpdate = now;
    currentTempC = getSimulatedTempC();
    // Compute fatigue every temp update
    bool spo2ok = (spo2Valid && spo2>70 && spo2<=100 && fingerPresent);
    currentFatigue = computeFatigue(filteredBPM, spo2, spo2ok);
  }

  // ── Serial debug (1 Hz) ─────────────────────────────────
  if (now - lastPrint >= 1000) {
    lastPrint = now;
    bool sg = (spo2Valid && spo2>70 && spo2<=100 && fingerPresent);
    bool bg = (sysBP>0 && diaBP>0 && fingerPresent);
    Serial.printf("IR:%ld | BPM:%s | SpO2:%s | Temp:%.1f°C | BP:%s | Fatigue:%d%s\n",
      irValue,
      (filteredBPM>0&&fingerPresent)?String((int)filteredBPM).c_str():"--",
      sg?(String(spo2)+"%").c_str():"--",
      currentTempC,
      bg?(String((int)sysBP)+"/"+String((int)diaBP)).c_str():"--",
      currentFatigue,
      !fingerPresent?" (Place Finger)":""
    );
  }

  // ── Send to Railway every 5 seconds ─────────────────────
  if (now - lastSend >= SEND_INTERVAL) {
    lastSend = now;
    bool sg = (spo2Valid && spo2>70 && spo2<=100 && fingerPresent);
    bool bpmGood = (filteredBPM>40 && fingerPresent);

    if (bpmGood && sg) {
      lastSendOK = sendVitals((int)filteredBPM,(int)spo2,sysBP,diaBP,currentTempC,currentFatigue,true);
    } else if (!fingerPresent) {
      lastSendOK = sendVitals(0,0,0,0,currentTempC,0,false);
    } else {
      Serial.println("[SEND] Waiting for stable reading...");
    }
    lastSendTime = now;
  }

  // ── Page auto-advance (5 pages) ─────────────────────────
  if (now - lastPageSwitch >= PAGE_DURATION) {
    lastPageSwitch = now;
    page = (page+1) % 5;
  }

  // ── OLED draw ───────────────────────────────────────────
  bool spo2Good = (spo2Valid && spo2>70 && spo2<=100 && fingerPresent);
  bool bpGood   = (sysBP>0 && diaBP>0 && fingerPresent);
  bool tempElev = ((int)(currentTempC*10.0f) >= ALARM_TEMP_WARN);
  bool tempCrit = ((int)(currentTempC*10.0f) >= ALARM_TEMP_CRIT);

  display.clearDisplay();

  // WiFi dot — top left
  if (WiFi.status()==WL_CONNECTED) {
    display.fillCircle(4, 4, 3, WHITE);
    if (now-lastSendTime<500 && lastSendOK) display.drawCircle(4,4,6,WHITE);
  } else {
    display.drawLine(1,1,7,7,WHITE); display.drawLine(7,1,1,7,WHITE);
  }

  // Alarm icon — top left (overrides WiFi dot when alarm)
  if (alarmActive && buzzerState) {
    display.setTextSize(1); display.setCursor(0,0); display.print("!");
  }

  // 5 page dots — top right
  for (byte i=0;i<5;i++) {
    int x = 90+i*8;
    if (i==page) display.fillCircle(x,4,3,WHITE);
    else         display.drawCircle(x,4,3,WHITE);
  }

  // ── PAGE 0: Heart Rate ────────────────────────────────
  if (page==0) {
    display.setTextSize(1); display.setCursor(12,0); display.print("HEART RATE");
    display.drawLine(0,11,85,11,WHITE);
    display.setCursor(0,14);
    if (!fingerPresent)           display.print(">> Place finger <<");
    else if (filteredBPM<1.0f)    display.print("Detecting beat...");
    else                          display.print("Reading  OK");
    display.setTextSize(3); display.setCursor(10,27);
    if (filteredBPM>0&&fingerPresent) display.print((int)filteredBPM);
    else display.print("---");
    display.setTextSize(1); display.setCursor(92,42); display.print("BPM");
    bool flash = fingerPresent && (now-lastBeatTime<BEAT_FLASH_MS);
    if (flash) display.fillCircle(7,56,5,WHITE); else display.drawCircle(7,56,5,WHITE);
    display.setCursor(18,53); display.print("Avg:"); display.print(avgBPM>0&&fingerPresent?String(avgBPM):"--");
    // Quality bar
    display.setCursor(72,53); display.print("Q:");
    for (byte q=0;q<RATE_SIZE;q++) {
      int bx=85+q*5; q<rateCount?display.fillRect(bx,54,4,6,WHITE):display.drawRect(bx,54,4,6,WHITE);
    }
  }

  // ── PAGE 1: SpO2 ──────────────────────────────────────
  else if (page==1) {
    display.setTextSize(1); display.setCursor(12,0); display.print("OXYGEN (SpO2)");
    display.drawLine(0,11,85,11,WHITE);
    display.setCursor(0,14);
    if (!fingerPresent)      display.print(">> Place finger <<");
    else if (!spo2Ready)     display.print("Buffering...");
    else if (!spo2Good)      display.print("Hold still...");
    else                     display.print("Reading  OK");
    if (fingerPresent && !spo2Ready) {
      display.setCursor(0,26); display.print("Buffer:");
      int pct=(int)((spo2Idx*100UL)/SPO2_BUF);
      display.setCursor(50,26); display.print(pct); display.print("%");
      display.drawRect(0,36,100,8,WHITE); display.fillRect(0,36,pct,8,WHITE);
    } else {
      display.setTextSize(3); display.setCursor(10,27);
      spo2Good?display.print(spo2):display.print("---");
      display.setTextSize(2); display.setCursor(88,27); display.print("%");
      display.setTextSize(1); display.setCursor(0,56);
      if (!spo2Good) display.print("Waiting for lock...");
      else if (spo2>=94) display.print("Normal - Healthy");
      else if (spo2>=87) display.print("Low - Recheck");
      else display.print("! CRITICAL");
    }
  }

  // ── PAGE 2: Temperature ───────────────────────────────
  else if (page==2) {
    display.setTextSize(1); display.setCursor(12,0); display.print("TEMPERATURE");
    display.drawLine(0,11,85,11,WHITE);
    display.setCursor(0,14);
    if (tempCrit) display.print("! High fever");
    else if (tempElev) display.print("Elevated - Fever?");
    else display.print("Normal");
    display.setTextSize(3); display.setCursor(4,27);
    display.print((int)currentTempC); display.print(".");
    display.print((int)(currentTempC*10.0f)%10);
    display.setTextSize(1); display.setCursor(92,35); display.print("\xF8""C");
    display.setCursor(0,56);
    if (currentTempC<35.0f) display.print("Hypothermia!");
    else if (currentTempC<36.1f) display.print("Below normal");
    else if (currentTempC<37.5f) display.print("Normal range");
    else if (currentTempC<38.5f) display.print("Low-grade fever");
    else display.print("! High fever");
  }

  // ── PAGE 3: Blood Pressure ────────────────────────────
  else if (page==3) {
    display.setTextSize(1); display.setCursor(12,0); display.print("BLOOD PRESSURE");
    display.drawLine(0,11,85,11,WHITE);
    display.setCursor(0,14);
    if (!fingerPresent) display.print(">> Place finger <<");
    else if (!bpGood)   display.print("Need BPM+SpO2 first");
    else                display.print("Estimate (optical) *");
    if (bpGood) {
      display.setTextSize(1); display.setCursor(2,28); display.print("SYS");
      display.setTextSize(2); display.setCursor(2,38); display.print((int)sysBP);
      display.setTextSize(2); display.setCursor(55,38); display.print("/");
      display.setTextSize(1); display.setCursor(76,28); display.print("DIA");
      display.setTextSize(2); display.setCursor(76,38); display.print((int)diaBP);
      display.setTextSize(1); display.setCursor(40,58); display.print("mmHg");
      display.setCursor(0,58);
      int s=(int)sysBP,d=(int)diaBP;
      if (s<120&&d<80) display.print("Normal");
      else if (s<130&&d<80) display.print("Elevated");
      else if (s<140||d<90) display.print("Stage 1 HTN");
      else display.print("Stage 2 HTN");
    } else {
      display.setTextSize(2); display.setCursor(20,36); display.print("--/--");
      display.setTextSize(1); display.setCursor(42,56); display.print("mmHg");
    }
  }

  // ── PAGE 4: Fatigue Index ─────────────────────────────
  else {
    display.setTextSize(1); display.setCursor(12,0); display.print("FATIGUE INDEX");
    display.drawLine(0,11,85,11,WHITE);

    display.setCursor(0,14);
    if (!fingerPresent) display.print(">> Place finger <<");
    else if (currentFatigue < 30) display.print("Well Rested");
    else if (currentFatigue < 45) display.print("Mildly Tired");
    else display.print("Moderately Tired");

    // Large fatigue number
    display.setTextSize(3); display.setCursor(18,27);
    display.print(fingerPresent?String(currentFatigue):"---");
    display.setTextSize(1); display.setCursor(85,42); display.print("/100");

    // Horizontal bar chart
    display.setCursor(0,55); display.print("Fatigue:");
    display.drawRect(48,53,70,8,WHITE);
    int barW = fingerPresent?(int)(currentFatigue*70/100):0;
    display.fillRect(48,53,barW,8,WHITE);
  }

  display.display();
  yield();
}
