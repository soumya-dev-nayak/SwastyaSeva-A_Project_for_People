const { broadcast } = require('../config/websocket');

const simulations = new Map();

const randBetween = (a, b) => +(a + Math.random() * (b - a)).toFixed(1);
const randInt = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Shared sensor state — all patients show same sensor reading for demo
let sharedSensorActive = false;
let sharedSensorData = null;

const markSensorActive = (patientId, data) => {
  sharedSensorActive = true;
  sharedSensorData = { ...data, patientId, timestamp: new Date() };
  // Reset after 15 seconds if no new reading
  clearTimeout(sharedSensorData._timeout);
  sharedSensorData._timeout = setTimeout(() => {
    sharedSensorActive = false;
    sharedSensorData = null;
  }, 15000);
};

const isSensorActive = () => sharedSensorActive;
const getSensorData = () => sharedSensorData;

// Start simulation for a patient
const startSimulation = (patientId) => {
  if (simulations.has(patientId)) return;

  let hr = randInt(68, 82);
  let sysBP = randInt(115, 125);
  let diaBP = randInt(72, 80);
  let spo2 = randBetween(97, 99);
  let temp = randBetween(36.4, 37.0);
  let fatigue = randInt(20, 40);

  const interval = setInterval(() => {
    // If real sensor is active, broadcast that instead
    if (sharedSensorActive && sharedSensorData) {
      broadcast('VITALS_UPDATE', {
        patientId,
        hr: sharedSensorData.hr,
        sysBP: sharedSensorData.sysBP,
        diaBP: sharedSensorData.diaBP,
        spo2: sharedSensorData.spo2,
        temp: sharedSensorData.temp,
        fatigue: sharedSensorData.fatigue || fatigue,
        source: 'sensor',
        finger: sharedSensorData.finger !== false,
        timestamp: new Date(),
        alerts: [],
      });
      return;
    }

    // Simulate gentle drift
    hr = clamp(Math.round(hr + (Math.random() - 0.5) * 4), 60, 100);
    sysBP = clamp(Math.round(sysBP + (Math.random() - 0.5) * 2), 105, 135);
    diaBP = clamp(Math.round(diaBP + (Math.random() - 0.5) * 2), 65, 90);
    spo2 = clamp(+(spo2 + (Math.random() - 0.5) * 0.5).toFixed(1), 95, 100);
    temp = clamp(+(temp + (Math.random() - 0.5) * 0.05).toFixed(1), 36.0, 37.5);
    fatigue = clamp(Math.round(fatigue + (Math.random() - 0.5) * 3), 10, 70);

    broadcast('VITALS_UPDATE', {
      patientId, hr, sysBP, diaBP, spo2, temp, fatigue,
      source: 'simulation', finger: true,
      timestamp: new Date(), alerts: [],
    });
  }, 5000);

  simulations.set(patientId, interval);
};

const stopSimulation = (patientId) => {
  if (simulations.has(patientId)) {
    clearInterval(simulations.get(patientId));
    simulations.delete(patientId);
  }
};

const stopAllSimulations = () => {
  for (const [, interval] of simulations) clearInterval(interval);
  simulations.clear();
};

module.exports = { startSimulation, stopSimulation, stopAllSimulations, markSensorActive, isSensorActive, getSensorData };
