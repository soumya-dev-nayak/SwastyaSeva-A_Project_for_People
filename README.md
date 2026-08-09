# SwastyaSeva — Integrated Patient Care & Hospital Management System

> **A comprehensive full-stack IoT healthcare platform** combining real-time physiological monitoring via ESP32 wearable wristbands, mmWave radar-based ward occupancy tracking, Node.js/Express backend with WebSocket support, React dashboard, and MongoDB database for seamless hospital operations and patient care delivery.

**Project Status:** ✅ Full-stack prototype completed | Hardware validated | Clinical accuracy: 90-98% | Ready for hospital deployment

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![Node.js](https://img.shields.io/badge/Node.js->=18.0.0-brightgreen)
![React](https://img.shields.io/badge/React-18.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)
![ESP32](https://img.shields.io/badge/ESP32-XIAO%20C3-red)
![Sensors](https://img.shields.io/badge/Sensors-MAX30102%20%26%20MAX30205-orange)
![mmWave Radar](https://img.shields.io/badge/mmWave-HLK%20LD2410B-blue)
![Hardware](https://img.shields.io/badge/Hardware-PCB%20%2B%20Wearable-success)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Project Architecture](#project-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [IoT Setup (ESP32)](#iot-setup-esp32)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [System Workflow](#system-workflow)
- [Real-Time Monitoring](#real-time-monitoring)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**SwastyaSeva** (Sanskrit: स्वास्थ्य = health, सेवा = service) is a comprehensive **Integrated Patient Care & Hospital Management System** designed to address critical gaps in modern hospital ward monitoring. It combines cutting-edge IoT hardware, wireless communication protocols, and cloud-based analytics into a unified, scalable platform for continuous patient monitoring and intelligent ward management.

### The Problem We Solve
Traditional hospitals face critical challenges:
- ❌ **Manual monitoring gaps**: Vitals checked every 4-8 hours; critical events can go undetected
- ❌ **Economic barriers**: Medical-grade monitors cost ₹50,000–₹2,00,000+ per unit
- ❌ **Staff burden**: Nursing workload prevents proactive patient care
- ❌ **Privacy concerns**: Camera-based occupancy tracking rejected by patients
- ❌ **Data blindness**: No real-time insights for hospital administrators

### Our Solution
SwastyaSeva delivers:

| Component | Technology | Capability |
|-----------|-----------|-----------|
| **Smart Wristband** | XIAO ESP32-C3 + MAX30102 + MAX30205 | Continuous heart rate, SpO₂, temperature monitoring |
| **Ward Occupancy** | HLK LD2410B mmWave Radar | Privacy-preserving crowd density & patient motion detection |
| **Wireless Network** | ESP-NOW + WiFi/MQTT | Sub-5ms local latency; sub-200ms alert escalation |
| **Backend Pipeline** | Node.js/Express + WebSocket | Real-time data aggregation and multi-role access |
| **Cloud Database** | MongoDB Atlas | Time-series vital tracking & historical analytics |
| **Web Dashboard** | React + Role-Based Access | Patient portal + Administrator management interface |

### Clinical Validation
- ✅ **90-98% correlation** with certified medical-grade pulse oximeters
- ✅ **86% BPM accuracy** on continuous monitoring
- ✅ **±1.5°C temperature accuracy**
- ✅ **85% occupancy detection accuracy** (mmWave radar)
- ✅ **99.2% packet delivery rate** (line-of-sight)
- ✅ **97.1% packet delivery** through walls

---

## Key Features

### 🏥 Patient Monitoring & Vital Signs
- **Continuous Multi-Parameter Monitoring**: Real-time heart rate (BPM), peripheral oxygen saturation (SpO₂), and core body temperature via MAX30102 optical biosensor and MAX30205 clinical-grade temperature sensor
- **Derived Diagnostic Parameters**: Onboard firmware algorithms compute estimated blood pressure and patient fatigue index without additional hardware
- **Multi-Modal Alerts**: Vibration motor + OLED visual alert + immediate WebSocket escalation to nurse dashboard (< 200ms)
- **Clinical Alert Thresholds**:
  - Heart Rate: < 50 or > 120 BPM → Alert
  - SpO₂: < 85% → Alert  
  - Temperature: > 38.5°C → Alert
  - All with customizable thresholds per patient

### 📍 Ward Occupancy & Environmental Monitoring
- **Privacy-Preserving mmWave Radar**: HLK LD2410B FMCW radar provides real-time crowd density and patient motion detection without imaging
- **Non-Contact Detection**: Simultaneously detects moving and stationary (breathing) individuals up to 6 meters away with 120° horizontal FOV
- **Compliance**: HIPAA-compliant alternative to camera-based surveillance; cannot capture identifiable visual information
- **Zone-Based Monitoring**: Strategic radar placement for entry points and ward zones enables precise occupancy tracking for bed management and emergency capacity planning

### 🏥 Comprehensive Patient Management
- **Patient Registration & Profiles**: Demographic data, medical history, chronic conditions, and physician assignments
- **Electronic Medical Records**: Centralized storage of diagnoses, treatments, medications, and surgical history
- **Appointment Scheduling**: Doctor-patient scheduling with automated reminders
- **Admission/Discharge Management**: Track hospital stays, bed allocation, and discharge summaries

### 📊 Real-Time Monitoring & Analytics
- **Live Dashboard**: WebSocket-driven real-time vital updates (340ms end-to-end latency for standard data; < 200ms for alerts)
- **Historical Trend Analysis**: 24-hour vital sign charts; 1-minute and 5-minute rolling averages
- **Critical Alert Audit Log**: Timestamped records of all threshold exceedances with escalation and resolution tracking
- **Predictive Analytics Ready**: Architecture supports future integration of MEWS (Modified Early Warning Score) and machine learning anomaly detection

### 👨‍⚕️ Role-Based Staff Management
- **Multi-Role Access Control**: Administrator, Doctor, Nurse, Patient, Family Member—each with role-specific dashboards
- **Task Assignment & Tracking**: Delegate nursing tasks and monitor completion
- **Shift Scheduling**: Staff availability and rotation management
- **Real-Time Notifications**: Critical alerts pushed to assigned caregivers via dashboard and WebSocket

### 🔐 Security & Healthcare Compliance
- **JWT Authentication**: Token-based login with 7-day expiry for session management
- **Password Security**: bcryptjs hashing with 10 salt rounds
- **Data Encryption**: HTTPS/WSS for all communications (both data and WebSocket)
- **Input Validation**: express-validator on all API endpoints to prevent injection attacks
- **Role-Based Access Control (RBAC)**: Patients see only their data; admins see system-wide metrics
- **Audit Logging**: All critical actions timestamped and logged to database
- **HIPAA-Aligned Architecture**: Supports healthcare data protection standards (identifiable data segregation, secure transmission, audit trails)

### ⚙️ Backend & Infrastructure
- **RESTful API**: Complete endpoints for vitals, patients, appointments, staff, and authentication
- **WebSocket Support**: Real-time bidirectional communication for live vital streaming and alert escalation
- **Error Handling**: Centralized error middleware with Morgan request logging
- **CORS Security**: Restrict cross-origin requests to authorized domains
- **Data Compression**: gzip middleware for optimized API response sizes
- **Security Hardening**: Helmet.js for HTTP header protection against XSS, clickjacking, MIME-type sniffing
- **Database Indexing**: Optimized queries on patient ID, timestamps, and vital thresholds

---

## System Architecture

SwastyaSeva employs a **hierarchical, multi-tiered IoT architecture** with distinct layers for sensing, aggregation, and analytics:

### High-Level System Overview

![Conceptual Diagram of Overall System](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Conceptual%20Diagram%20of%20Overall%20System.png?raw=true)
*Figure 1: Conceptual diagram showing the end-to-end SwastyaSeva ecosystem — from wearable sensor nodes through gateway aggregation to cloud analytics and web dashboard.*

### Integrated Patient Monitoring System Architecture

![Integrated Patient Monitoring System](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Integrated%20patient%20monitoring%20system%20.png?raw=true)
*Figure 2: Detailed view of the integrated patient monitoring system showing wristband, gateway, server, and dashboard integration.*

### Block Diagram: Component-Level Architecture

![Block Diagram of Patient Care System](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Block%20Diagram%20of%20Patient%20Care%20System%20.png?raw=true)
*Figure 3: Block diagram of the patient care system showing signal flow through each hardware component, from sensors through microcontroller to wireless transmission.*

### Detailed Multi-Tiered Architecture

**Circuit Diagrams & Hardware Details**

![Detailed Circuit Diagram of the Wristband System](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Detailed%20Circuit%20Diagram%20of%20the%20Wristband%20band%20system.png?raw=true)
*Figure 4: Detailed circuit diagram of the XIAO ESP32-C3 wristband node showing I2C connections to MAX30102 (biosensor) and MAX30205 (temperature sensor), OLED display, emergency button, and vibration motor.*

![5V DC Power Supply Circuit Diagram](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/5V%20DC%20Power%20Supply%20CKT%20Diagram%20.png?raw=true)
*Figure 5: 5V regulated DC power supply circuit for the ESP32 Ward Gateway and mmWave radar modules, using transformer-rectifier topology with 7805 linear regulator.*

![Table: Clinical Vital Sign Alert Thresholds](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Table-1%20Clinical%20Vital%20Sign%20Alert%20Thresholds%20.png?raw=true)
*Figure 6: Clinical alert threshold table defining normal ranges and alert triggers for heart rate, SpO₂, body temperature, and blood pressure.*

**System Architecture Diagram**
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SwastyaSeva IoT Ecosystem                           │
└─────────────────────────────────────────────────────────────────────────────┘

TIER 1: SENSING LAYER (Wearable + Environmental)
┌──────────────────────────────────┐      ┌──────────────────────────────────┐
│   XIAO ESP32-C3 Wristband Node   │      │  HLK LD2410B mmWave Radar Module │
│                                  │      │                                  │
│  ┌──────────────────────────────┐│      │  ┌──────────────────────────────┐│
│  │ MAX30102 Optical Biosensor   ││      │  │ 24GHz FMCW Radar (6m range)  ││
│  │ • Heart Rate (BPM)           ││      │  │ • Crowd Density Detection    ││
│  │ • SpO₂ (%)                   ││      │  │ • Motion Detection           ││
│  └──────────────────────────────┘│      │  │ • Privacy-Preserving         ││
│                                  │      │  └──────────────────────────────┘│
│  ┌──────────────────────────────┐│      │                                  │
│  │ MAX30205 Temperature Sensor  ││      │  UART → Ward Gateway            │
│  │ • Body Temperature (°C)      ││      └──────────────────────────────────┘
│  └──────────────────────────────┘│
│                                  │
│  Alert Mechanisms:               │
│  • Buzzer + Vibration           │
│  • OLED Alert Display           │
│  • Priority Flag in Packet      │
│                                  │
│  Power: 3.7V LiPo (900mAh)      │
│  Duty Cycle: 5-sec sampling     │
│  Battery Life: 8-12 hours       │
└──────────────────────────────────┘
         │ (ESP-NOW, <5ms)
         │ (MAC Address Registration)
         │
TIER 2: AGGREGATION LAYER (Ward Gateway)
┌─────────────────────────────────────────────────────────────────┐
│              ESP32-WROOM-32 Ward Gateway (Ceiling-Mounted)      │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ESP-NOW Receiver (Dual-Core Parallel Processing)          │ │
│  │ • Wristband packet aggregation                            │ │
│  │ • Radar data integration                                  │ │
│  │ • Local JSON buffering                                    │ │
│  │ • MAC → Patient ID mapping                                │ │
│  └───────────────────────────────────────────────────────────┘ │
│                          │                                      │
│                          ▼                                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Protocol Translation & Failsafe Logic                     │ │
│  │ • Normal data: Buffer + uplink every 10 seconds           │ │
│  │ • Alert data: Immediate transmission (bypasses buffer)    │ │
│  │ • Offline mode: Log to flash memory on WiFi loss          │ │
│  │ • Auto-resume: Replay buffered data on reconnection       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                          │                                      │
│  Power: 5V DC (continuous, wall-mounted)                        │
│  Status LEDs: Gateway health indicator                          │
└─────────────────────────────────────────────────────────────────┘
         │ (WiFi STA Mode + HTTP/MQTT)
         │
TIER 3: CLOUD & ANALYTICS LAYER
┌──────────────────────────────────────┐  ┌────────────────────────────┐
│   Hospital Backend Server            │  │   MongoDB Atlas            │
│   (Node.js/Express - Render.com)     │  │   (Time-Series Database)   │
│                                      │  │                            │
│  ┌──────────────────────────────────┐│  │  ┌────────────────────────┐│
│  │ HTTP/MQTT Message Handler        ││  │  │ Vital Sign Collection  ││
│  │ • Parse incoming packets         ││  │  │ • Real-time data       ││
│  │ • Validate & store to DB         ││  │  │ • Historical records   ││
│  │ • Compute rolling averages       ││  │  │ • Alert audit trail    ││
│  └──────────────────────────────────┘│  │  └────────────────────────┘│
│                                      │  │                            │
│  ┌──────────────────────────────────┐│  │  ┌────────────────────────┐│
│  │ WebSocket Gateway                ││  │  │ Patient Collections    ││
│  │ • Broadcast live vitals          ││  │  │ • Demographics         ││
│  │ • Push priority alerts           ││  │  │ • Medical history      ││
│  │ • Multi-client fan-out           ││  │  │ • Current status       ││
│  └──────────────────────────────────┘│  │  └────────────────────────┘│
│                                      │  │                            │
│  ┌──────────────────────────────────┐│  │  ┌────────────────────────┐│
│  │ RESTful API Endpoints            ││  │  │ Ward Occupancy Data    ││
│  │ /api/patients (CRUD)             ││  │  │ • Occupancy counts     ││
│  │ /api/vitals (read time-series)   ││  │  │ • Zone-based tracking  ││
│  │ /api/appointments (management)   ││  │  │ • Trend analysis       ││
│  │ /api/alerts (audit log)          ││  │  │ • Capacity planning    ││
│  └──────────────────────────────────┘│  │  └────────────────────────┘│
│                                      │  │                            │
│  Security: JWT Auth, Helmet.js       │  │ Indexes: Patient ID,       │
│  Logging: Morgan request logs        │  │ Timestamps, Alert flags    │
└──────────────────────────────────────┘  └────────────────────────────┘
         │ (REST + WebSocket)
         │
TIER 4: PRESENTATION LAYER (Web Dashboard)
┌──────────────────────────────────────────────────────────────────┐
│   React Web Dashboard (Vercel)                                   │
│                                                                  │
│  ┌────────────────────────┐      ┌────────────────────────────┐ │
│  │  Patient Portal        │      │  Administrator Dashboard   │ │
│  │  ┌──────────────────┐  │      │  ┌────────────────────────┐ │
│  │  │ My Vitals (Live) │  │      │  │ All Patient Vitals (RT)│ │
│  │  │ 24h Trend Graph  │  │      │  │ Ward Occupancy Map     │ │
│  │  │ Alert History    │  │      │  │ Critical Alert Log     │ │
│  │  │ Appointments     │  │      │  │ System Health Status   │ │
│  │  │ Profile          │  │      │  │ Staff Management       │ │
│  │  └──────────────────┘  │      │  └────────────────────────┘ │
│  └────────────────────────┘      └────────────────────────────┘ │
│                                                                  │
│  Role-Based Access Control (RBAC):                              │
│  • Patient: Own vitals only                                     │
│  • Doctor: Assigned patients + ward overview                    │
│  • Nurse: Real-time alerts + task management                    │
│  • Admin: System-wide analytics + staff management              │
│                                                                  │
│  Socket.IO Client: Real-time WebSocket updates                  │
│  Axios HTTP Client: RESTful API calls                           │
└──────────────────────────────────────────────────────────────────┘

═════════════════════════════════════════════════════════════════════

COMMUNICATION PROTOCOLS:

Layer 1→2 (Local Sensing):
  Protocol: ESP-NOW (Espressif proprietary 802.11 management frames)
  Latency: < 5ms per packet
  Power: Ultra-low (optimal for battery-powered wristbands)
  Topology: Peer-to-peer broadcast to registered gateway MAC
  Packet Format: JSON (MAC address, timestamp, vitals, alert_flag)

Layer 2→3 (Upstream):
  Protocol: WiFi (Station Mode) + HTTP POST + MQTT (optional)
  Latency: ~50-100ms per hop
  Reliability: TCP/IP ensures delivery
  Uplink Interval: 10 seconds (normal data); immediate (alerts)
  Failsafe: Local flash buffering during WiFi outages

Layer 3→4 (Presentation):
  Protocol: WebSocket (Socket.IO) + HTTP REST
  Latency: 340ms end-to-end (measurement → display)
  Bidirectional: Real-time push + request-response
  Broadcast: All connected dashboard clients receive live updates

═════════════════════════════════════════════════════════════════════
```

### Data Flow Example (Normal Monitoring Cycle)
```
T=0ms:    MAX30102 captures 100 PPG samples from finger capillary bed
T=100ms:  Moving average filter removes motion artifacts → HR & SpO₂ computed
T=105ms:  MAX30205 reads body temperature via I2C
T=110ms:  Thresholds checked; JSON packet assembled with vitals + MAC address
T=115ms:  Packet broadcast via ESP-NOW → Ward Gateway (< 5ms delivery)
T=120ms:  Gateway receives, appends server timestamp, buffers in RAM FIFO
T=10s:    (Normal cycle) Gateway publishes buffered vitals to backend HTTP
T=10.05s: Backend stores to MongoDB time-series collection
T=10.1s:  WebSocket broadcasts to all connected React dashboard clients
T=10.2s:  React updates vital gauges and trend charts in real-time
T=10.34s: User sees latest vitals on screen (end-to-end latency: 340ms)

ALERT CYCLE (When vital exceeds threshold):
T=0ms:    MAX30102 detects SpO₂ = 82% (< 85% threshold)
T=110ms:  alert_flag set to 1; JSON packet assembled
T=115ms:  Packet broadcast via ESP-NOW with max retry count
T=120ms:  OLED display: Full-screen alert; Buzzer: Pulsed tone
T=125ms:  Gateway receives priority alert, IMMEDIATELY publishes to backend
T=130ms:  Backend validates, stores to DB, broadcasts to WebSocket clients
T=150ms:  React dashboard: Alert banner appears + notification sound
T=160ms:  Nurse's phone: Push notification (if mobile app connected)
T=200ms:  Alert fully escalated to clinical staff (< 200ms total)
```

---

## Tech Stack

### Frontend (React Dashboard)
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.x | Component-based UI framework |
| React Router | Latest | Multi-page navigation (Patient, Admin, Login) |
| Socket.IO Client | Latest | Real-time WebSocket for live vital streaming |
| Axios | Latest | HTTP client for RESTful API calls |
| Chart.js / Recharts | Latest | 24-hour vital trend visualization |
| Bootstrap / Tailwind | Latest | Responsive UI design |
| CSS3 | Latest | Custom styling and animations |
| Deployment | Vercel | Serverless deployment with auto-scaling |

### Backend (Node.js/Express)
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | >=18.0.0 | Runtime environment |
| Express.js | 4.18.2 | Web framework, HTTP routing, middleware |
| Socket.IO | Latest | Real-time bidirectional WebSocket communication |
| Mongoose | 7.6.3 | MongoDB ODM for schema validation & queries |
| MongoDB | Latest | NoSQL time-series database (Atlas) |
| JWT (jsonwebtoken) | 9.0.2 | Token-based authentication & authorization |
| bcryptjs | 2.4.3 | Password hashing (10 salt rounds) |
| express-validator | 7.0.1 | Input validation & sanitization |
| Helmet.js | 7.1.0 | HTTP header security (XSS, clickjacking protection) |
| CORS | 2.8.5 | Cross-origin request handling |
| Morgan | 1.10.0 | HTTP request logging |
| Compression | 1.7.4 | gzip middleware for response optimization |
| Deployment | Render.com | Container-based backend hosting |

### IoT & Hardware Layer
| Component | Specification | Purpose |
|-----------|---------------|---------|
| **XIAO ESP32-C3** | RISC-V 160MHz, 21×17.5mm | Wristband processor |
| **MAX30102** | Optical biosensor (660nm red + 880nm IR) | Heart rate & SpO₂ measurement via PPG |
| **MAX30205** | 16-bit I2C temperature sensor | Clinical-grade body temperature monitoring |
| **HLK LD2410B** | 24GHz FMCW mmWave radar, 6m range, 120° FOV | Privacy-preserving occupancy detection |
| **SSD1306 OLED** | 0.96" 128×64 I2C display | Real-time wristband vitals display |
| **TP4056A** | Li-ion/LiPo charger IC | Battery management for 3.7V LiPo |
| **3.7V LiPo Battery** | 900mAh | Wristband power (8-12 hour runtime) |
| **ESP32-WROOM-32** | Dual-core 240MHz, 4MB flash | Ward gateway processor |
| **5V DC Power Supply** | Regulated transformer-rectifier module | Gateway & radar continuous power |
| **Arduino IDE** | Latest | Firmware development & flashing |

### Wireless Communication Protocols
| Protocol | Layer | Latency | Power | Use Case |
|----------|-------|---------|-------|----------|
| **ESP-NOW** | Wristband ↔ Gateway | < 5ms | Ultra-low | Local sensing mesh |
| **Wi-Fi (802.11 b/g/n)** | Gateway ↔ Server | ~50-100ms | Moderate | Upstream aggregation |
| **HTTP POST** | Gateway → Backend | ~100-200ms | Moderate | Data persistence |
| **WebSocket (Socket.IO)** | Backend → Dashboard | ~340ms (end-to-end) | Moderate | Real-time broadcasting |
| **MQTT (Optional)** | Gateway → Broker | ~100ms | Moderate | Alternative pub-sub |
| **UART (Serial)** | Radar → Gateway | 256000 baud | Low | Local occupancy data |
| **I2C** | ESP32 ↔ Sensors | ~100μs per byte | Minimal | On-device sensor bus |

### Database & Cloud Services
| Service | Purpose | Tier |
|---------|---------|------|
| MongoDB Atlas | Cloud time-series database for vitals, patients, alerts | Shared/Pro |
| Render.com | Backend container deployment with auto-scaling | Free/Paid |
| Vercel | Frontend React hosting with CDN | Free/Pro |
| GitHub | Version control & continuous integration | Free |

---

## Project Structure

```
SwastyaSeva-A_Project_for_People/
│
├── SwaystyaSeva-backend/          # Node.js/Express backend
│   ├── server.js                  # Express server entry point
│   ├── package.json               # Backend dependencies
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   └── environment.js         # Configuration management
│   ├── models/
│   │   ├── User.js                # User schema (Staff, Patients)
│   │   ├── Patient.js             # Patient records schema
│   │   ├── Vitals.js              # Real-time vitals data
│   │   ├── Appointment.js         # Appointment schema
│   │   └── MedicalRecord.js       # Medical history
│   ├── routes/
│   │   ├── auth.js                # Authentication endpoints
│   │   ├── patients.js            # Patient CRUD operations
│   │   ├── vitals.js              # Vitals data endpoints
│   │   ├── appointments.js        # Appointment management
│   │   └── staff.js               # Staff management
│   ├── middleware/
│   │   ├── auth.js                # JWT verification
│   │   ├── validation.js          # Input validation
│   │   └── errorHandler.js        # Centralized error handling
│   ├── websocket/
│   │   └── vitalsStream.js        # WebSocket handlers for live data
│   └── seed/
│       └── seed.js                # Database seeding script
│
├── hospital-api/                  # React frontend (alternative API)
│   ├── package.json               # Frontend dependencies
│   ├── public/
│   │   └── index.html             # HTML entry point
│   ├── src/
│   │   ├── App.jsx                # Main React component
│   │   ├── index.js               # React DOM render
│   │   ├── components/
│   │   │   ├── Dashboard.jsx      # Main dashboard
│   │   │   ├── PatientList.jsx    # Patient management
│   │   │   ├── VitalsMonitor.jsx  # Real-time vitals display
│   │   │   ├── Appointments.jsx   # Appointment interface
│   │   │   └── Auth.jsx           # Login/registration
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Patient.jsx
│   │   ├── services/
│   │   │   ├── api.js             # API client (Axios)
│   │   │   └── websocket.js       # WebSocket connection
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   └── components.css
│   │   └── utils/
│   │       └── helpers.js         # Utility functions
│   └── .vercelrc                  # Vercel deployment config
│
├── Wristwatch_Main_Code_ESP32.ino # IoT firmware for ESP32
│   ├── WiFi Configuration         # Network settings
│   ├── Sensor Initialization      # Setup sensor libraries
│   ├── Data Collection Loop       # Read vitals every 5-10s
│   ├── WebSocket Client           # Connect to backend
│   └── Transmission Protocol      # Send data as JSON
│
├── pics/                          # Project documentation images
│   ├── architecture.png
│   ├── dashboard.png
│   └── wearable.png
│
├── .gitignore                     # Git ignore rules
├── LICENSE                        # MIT License
└── README.md                      # This file

```

---

## Hardware Specifications & Bill of Materials

### Wristband Node (Per Unit)

| Component | Model | Specification | Cost (₹) | Purpose |
|-----------|-------|---------------|----------|---------|
| Microcontroller | XIAO ESP32-C3 | RISC-V 160MHz, 4MB flash, 400KB SRAM | 450 | Main processor |
| Optical Biosensor | MAX30102 | Pulse oximetry + HR via PPG (660/880nm) | 800 | Heart rate & SpO₂ |
| Temperature Sensor | MAX30205 | I2C, ±0.1°C accuracy, 0-50°C range | 200 | Body temperature |
| OLED Display | SSD1306 | 0.96" 128×64, I2C, 3.3V | 150 | Local status display |
| Battery | 3.7V LiPo 900mAh | — | 200 | Power source |
| Charger Module | TP4056A | Li-ion/LiPo CC-CV charging IC | 50 | Battery management |
| Passive Components | Resistors, capacitors, inductors | Various values | 100 | Filtering & voltage regulation |
| Vibration Motor | 3-5V coin vibrator | Tactile feedback | 50 | Alert mechanism |
| PCB & Connectors | Custom PCB + JST connectors | Prototype-grade | 200 | Wiring & assembly |
| Wristband Strap | Silicone/fabric | Comfortable fit, adjustable | 150 | Wearable form factor |
| **Wristband Total** | — | — | **₹2,350** | Per patient device |

### Ward Gateway (Per Ward)

| Component | Model | Specification | Cost (₹) | Purpose |
|-----------|-------|---------------|----------|---------|
| Main Processor | ESP32-WROOM-32 Dev Board | Dual-core 240MHz, 4MB flash, 520KB SRAM | 600 | Aggregation hub |
| Radar Module | HLK LD2410B | 24GHz FMCW, 6m range, 120° FOV | 1,500 | Occupancy detection |
| Power Supply | 5V DC regulated supply | AC-to-DC transformer + 7805 regulator | 400 | Continuous power |
| Status LEDs | 3× LED + resistors | Indicator for gateway health | 50 | Visual feedback |
| Cabling & Housing | Ethernet/RS485 cable | CAT5/6, shielded | 200 | Professional installation |
| **Gateway Total** | — | — | **₹2,750** | Per ward setup |

### Hospital Server (One-Time)
- Standard cloud VM (Render.com): **₹500-2000/month**
- MongoDB Atlas (cloud database): **₹0-5000/month** (depending on data volume)

**Total Cost per Patient (Amortized):** ~₹2,350 (vs. ₹50,000–₹2,00,000+ for commercial monitors)

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **MongoDB Atlas** account ([Sign up free](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))
- **Arduino IDE** >= 1.8.19 (for ESP32 firmware) ([Download](https://www.arduino.cc/))
- **USB-C Cable** (for ESP32 programming & power)
- **Soldering iron** (optional, for custom PCB assembly)

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People.git
   cd SwastyaSeva-A_Project_for_People
   ```

2. **Navigate to backend directory:**
   ```bash
   cd SwaystyaSeva-backend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Create `.env` file** in the backend root:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/swastyaseva
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRE=7d
   
   # CORS
   CORS_ORIGIN=http://localhost:3000
   
   # Email (optional, for notifications)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   
   # WebSocket
   WS_PORT=5001
   ```

5. **Seed the database** (optional, for test data):
   ```bash
   npm run seed
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   Backend should now be running at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ../hospital-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** in the frontend root:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_WS_URL=ws://localhost:5001
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```
   
   Frontend should now be running at `http://localhost:3000`

### IoT Setup (ESP32)

1. **Install Arduino IDE** and add ESP32 board support:
   - Open Arduino IDE → Preferences
   - Add to Additional Boards Manager URLs: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Go to Tools → Board Manager → Search "esp32" → Install

2. **Install required libraries:**
   - Sketch → Include Library → Manage Libraries
   - Search and install:
     - **ArduinoJson** (for JSON serialization)
     - **WiFi** (built-in)
     - **WebSocketClient** (or equivalent)
     - Sensor libraries (for HR, BP, SpO2 sensors)

3. **Configure WiFi & Backend:**
   - Open `Wristwatch_Main_Code_ESP32.ino`
   - Update WiFi credentials:
     ```cpp
     const char* ssid = "Your_WiFi_SSID";
     const char* password = "Your_WiFi_Password";
     const char* serverIP = "your-backend-domain.com";
     const int serverPort = 5001; // WebSocket port
     ```

4. **Upload to ESP32:**
   - Select Tools → Board → "ESP32 Dev Module"
   - Select appropriate COM port
   - Click Upload

5. **Monitor serial output:**
   - Tools → Serial Monitor
   - Set baud rate to 115200
   - Verify WiFi connection and data transmission

---

## Configuration

### Environment Variables

#### Backend (`.env`)
```env
# Critical: Change these in production
JWT_SECRET=your-secure-random-string-min-32-chars
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Optional: Email notifications
SMTP_USER=alerts@hospital.com
SMTP_PASS=secure-app-password

# Security
CORS_ORIGIN=https://your-frontend-domain.com
NODE_ENV=production
```

#### Frontend (`.env`)
```env
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_WS_URL=wss://your-backend-domain.com
```

---

## Deployment

### Backend Deployment (Render.com)

1. **Create Render account** at [render.com](https://render.com)

2. **Connect GitHub repository**

3. **Create new Web Service:**
   - Select repository
   - Environment: Node
   - Build command: `npm install`
   - Start command: `npm start`

4. **Set environment variables** in Render dashboard

5. **Deploy** — Render will auto-deploy on git push

### Frontend Deployment (Vercel)

1. **Create Vercel account** at [vercel.com](https://vercel.com)

2. **Import project:**
   - Click "Import Project"
   - Select your GitHub repository
   - Select "hospital-api" folder as root

3. **Set environment variables**

4. **Deploy** — Vercel auto-deploys on git push

### Database (MongoDB Atlas)

1. **Create cluster** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Get connection string:**
   - Clusters → Connect → Drivers
   - Copy connection string
   - Replace `<username>` and `<password>`

3. **Whitelist IP addresses:**
   - Network Access → Add IP Address
   - Add deployment server IPs

---

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "doctor@hospital.com",
  "password": "secure_password",
  "role": "doctor",
  "name": "Dr. Smith"
}

Response: 201 Created
{
  "token": "eyJhbGc...",
  "user": { "id": "...", "email": "...", "role": "doctor" }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "doctor@hospital.com",
  "password": "secure_password"
}

Response: 200 OK
{
  "token": "eyJhbGc...",
  "user": { "id": "...", "role": "doctor" }
}
```

### Patient Endpoints

#### Get All Patients
```http
GET /api/patients
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "_id": "patient_id",
    "name": "John Doe",
    "age": 45,
    "medicalHistory": [...],
    "admissionDate": "2024-01-15",
    "status": "admitted"
  }
]
```

#### Get Patient Vitals
```http
GET /api/vitals/:patientId
Authorization: Bearer <token>

Response: 200 OK
{
  "patientId": "...",
  "heartRate": 72,
  "bloodPressure": "120/80",
  "spO2": 98,
  "temperature": 37.2,
  "timestamp": "2024-01-20T10:30:00Z"
}
```

#### Create Patient
```http
POST /api/patients
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "age": 35,
  "gender": "female",
  "contactNumber": "+91-9999999999",
  "medicalHistory": ["diabetes"]
}

Response: 201 Created
```

---

## System Workflow

### Patient Admission Flow
```
1. Patient Registration
   ↓
2. Doctor Assignment
   ↓
3. Bed Allocation & Admit
   ↓
4. Assign IoT Wearable (ESP32)
   ↓
5. Start Real-Time Monitoring
   ↓
6. Dashboard receives live vitals
   ↓
7. Medical team reviews & responds
   ↓
8. Treatment & Discharge
```

### Real-Time Data Flow
```
ESP32 Wristwatch
     ↓ (WiFi + JSON)
Backend (Express)
     ↓ (WebSocket)
MongoDB (Persist)
     ↓ (Broadcast)
React Dashboard (Display)
     ↓ (User Action)
Backend API (Update)
     ↓
MongoDB (Store)
```

---

## Real-Time Monitoring & Data Streaming

### WebSocket Connection (Socket.IO)

The backend maintains persistent WebSocket connections for sub-second vital sign streaming:

```javascript
// Frontend React component
import io from 'socket.io-client';

const Dashboard = () => {
  useEffect(() => {
    const socket = io(process.env.REACT_APP_WS_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
    });

    // Subscribe to live vitals for specific patient
    socket.emit('subscribe_patient', { patientId: 'ABC123' });

    // Receive real-time vital updates (340ms latency)
    socket.on('vitals_update', (data) => {
      console.log(`Patient ${data.patientId}:`);
      console.log(`  HR: ${data.vitals.heartRate} BPM`);
      console.log(`  SpO₂: ${data.vitals.spO2}%`);
      console.log(`  Temp: ${data.vitals.temperature}°C`);
      updateDashboard(data);
    });

    // Receive priority alerts (< 200ms latency)
    socket.on('critical_alert', (alert) => {
      triggerAudioNotification();
      displayAlertBanner(alert);
    });

    return () => socket.disconnect();
  }, []);

  return <VitalGauges data={vitalsState} />;
};
```

### ESP32 Wristband Firmware Data Cycle

**Data Processing & Firmware Algorithm**

![Flow Chart of Data Processing and Actuation](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Flow%20Chart%20of%20Data%20Processing%20and%20Actuation%20.svg?raw=true)
*Figure 7: Flowchart showing the firmware algorithm for data acquisition, processing, threshold checking, alert actuation, and wireless transmission on the XIAO ESP32-C3 wristband.*

**Sampling & Transmission Flow (Every 5 Seconds):**
```
1. MAX30102: Acquire 100 PPG samples @ 100 Hz = 1 second burst
2. Signal Processing: Moving average + noise filtering
3. Computation: Extract HR (BPM) & SpO₂ (%) from R-ratio
4. MAX30205: Read I2C temperature register (50ms conversion)
5. Threshold Check: Compare all vitals against clinical limits
6. JSON Assembly: Construct data packet with MAC address + timestamp
7. ESP-NOW Broadcast: Transmit to Ward Gateway MAC (< 5ms)
8. Light Sleep: ESP32-C3 enters ultra-low-power mode (~1mA)
```

### Data Packet Format (Wristband → Gateway)

**JSON over ESP-NOW:**
```json
{
  "device_mac": "A4:C1:38:A1:B2:C3",
  "patient_id": "60a7f1b2c1d2e3f4g5h6i7j8",
  "timestamp": 1705755015000,
  "vitals": {
    "heartRate": 72,
    "heartRateQuality": 0.95,
    "spO2": 98,
    "spO2Quality": 0.92,
    "temperature": 37.2
  },
  "derived": {
    "bloodPressure_systolic": 118,
    "bloodPressure_diastolic": 76,
    "fatigueIndex": 0.15
  },
  "alert_flag": 0,
  "battery_percentage": 65,
  "signal_strength_rssi": -45
}
```

**Backend Broadcast (WebSocket to Dashboard):**
```json
{
  "patientId": "60a7f1b2c1d2e3f4g5h6i7j8",
  "patientName": "John Doe",
  "room": "Ward-A Bed-3",
  "timestamp": "2024-01-20T10:30:15.000Z",
  "vitals": {
    "heartRate": 72,
    "heartRateStatus": "normal",
    "spO2": 98,
    "spO2Status": "normal",
    "temperature": 37.2,
    "temperatureStatus": "normal",
    "bloodPressure": {
      "systolic": 118,
      "diastolic": 76,
      "status": "normal"
    }
  },
  "trends": {
    "hr_1min_avg": 71,
    "hr_5min_avg": 70,
    "spO2_1min_avg": 98
  },
  "alert": null
}
```

### Clinical Alert System & Thresholds

**Vital Sign Alert Thresholds:**
```
┌────────────────┬──────────────────┬─────────────────────────┬──────────────┐
│ Vital Sign     │ Normal Range     │ Alert Threshold         │ Alert Type   │
├────────────────┼──────────────────┼─────────────────────────┼──────────────┤
│ Heart Rate     │ 65–100 BPM       │ < 50 or > 120 BPM      │ Tachycardia/ │
│                │                  │                         │ Bradycardia  │
├────────────────┼──────────────────┼─────────────────────────┼──────────────┤
│ SpO₂           │ 95–100%          │ < 85%                   │ Hypoxemia    │
│ (Oxygen Sat.)  │                  │                         │              │
├────────────────┼──────────────────┼─────────────────────────┼──────────────┤
│ Temperature    │ 36.1–37.2°C      │ > 38.5°C                │ Fever        │
│                │                  │ (or < 35°C if enabled)  │ (Hypotherm.) │
├────────────────┼──────────────────┼─────────────────────────┼──────────────┤
│ Blood Pressure │ 110–140 / 70–90  │ Systolic < 90 or > 180  │ Hypo/Hyper-  │
│ (Estimated)    │ mmHg             │ Diastolic < 60 or > 110 │ tension      │
└────────────────┴──────────────────┴─────────────────────────┴──────────────┘
```

**Multi-Modal Alert Actuation (When Threshold Exceeded):**

1. **Wristband Local Alerts (Immediate, <100ms):**
   - OLED Display: Full-screen alert banner with large vital value & alert icon
   - Buzzer: 500ms on, 200ms off pulsed tone (audible radius ~5 meters)
   - Vibration Motor: Tactile pulse pattern (silent, patient-only feedback)

2. **Gateway Escalation (< 5ms):**
   - alert_flag set to 1 in packet
   - Transmitted with maximum ESP-NOW retry count
   - Bypasses normal 10-second uplink buffer

3. **Backend Processing (< 50ms):**
   - Immediate HTTP publication to server (not buffered)
   - Database: Insert alert record with timestamp & patient context
   - Validation: Cross-reference with patient history for trends

4. **Dashboard Notification (< 200ms total escalation):**
   - WebSocket broadcast to admin dashboard
   - Alert banner with patient name, room, vital value, threshold
   - Audio notification (alert sound) + visual pulsing
   - Alert log entry with click-through for patient details

5. **Future: Mobile Push (Optional):**
   - Push notification to assigned nurse's phone (if mobile app deployed)
   - Deep link directly to patient's dashboard

**Alert Priority Levels:**
```
CRITICAL (P0): SpO₂ < 80% → Immediate audio + haptic
HIGH (P1):     HR < 40 or > 130 BPM → Buzzer + dashboard
MODERATE (P2): Temp > 39°C → Gentle vibration + log
```

---

## Development

### Running Tests
```bash
cd SwaystyaSeva-backend
npm test
```

### Code Standards
- Use ESLint for code quality
- Follow Express.js best practices
- Validate all inputs
- Implement proper error handling
- Use meaningful commit messages

### Database Seeding

Populate test data:
```bash
npm run seed
```

This creates sample users, patients, and appointments for development.

### Logging

Backend logs all requests via Morgan:
```
POST /api/patients 201 - 45.234 ms
GET /api/vitals/xyz 200 - 12.456 ms
```

---

## Web Dashboard & User Interface

SwastyaSeva provides comprehensive web-based interfaces for both patients and hospital administrators. The dashboard is built with React and integrates real-time WebSocket updates for live vital sign monitoring.

### Authentication & User Access

![Website Login Page](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Website%20Login%20page.png?raw=true)
*Figure 8: Secure login interface with role-based authentication. Users can access as Patient, Doctor, Nurse, or Administrator.*

![Website State Choose Page](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Website%20State%20Choose%20page.png?raw=true)
*Figure 9: Role selection interface for users with multiple access roles.*

### Patient Portal

![User Starting Page](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/User%20Starting%20page.png?raw=true)
*Figure 10: Patient dashboard landing page with quick access to vital information.*

![User Dashboard](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/User%20Dashboard.png?raw=true)
*Figure 11: Real-time patient dashboard showing current vital signs with status indicators.*

![User Vitals Graph](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/User%20Vitals%20Graph.png?raw=true)
*Figure 12: 24-hour vital sign trend visualization showing heart rate, SpO₂, and temperature over time.*

![Booking Appointment](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Booking%20Appointment.png?raw=true)
*Figure 13: Appointment scheduling interface for patients to book consultations with doctors.*

![Hospital Directions with Google Maps](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Hospital%20Directions%20linked%20with%20Google%20maps.png?raw=true)
*Figure 14: Hospital location and directions integrated with Google Maps for patient navigation.*

![User Profile](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/User%20Profile.png?raw=true)
*Figure 15: Patient profile page showing personal information, medical history, and emergency contacts.*

### Administrator Dashboard

![Administrator Dashboard](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Administrator%20Dashboard.png?raw=true)
*Figure 16: Comprehensive admin dashboard showing all active patients, their vital signs in real-time, and system status.*

![Administrator's Doctor Management](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Administrator%E2%80%99s%20Doctor%20Management.png?raw=true)
*Figure 17: Doctor and staff management interface for scheduling, assignments, and performance tracking.*

![Administrator's Analytics of Patient Monitoring](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Administrator%E2%80%99s%20Analytics%20of%20Patient%20Monitoring.png?raw=true)
*Figure 18: Advanced analytics dashboard showing patient monitoring trends, occupancy patterns, and predictive health metrics.*

![Ward Occupancy Monitoring](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Ward%20Occupancy%20monitoring.png?raw=true)
*Figure 19: Real-time ward occupancy visualization powered by mmWave radar, showing patient density per zone.*

---

## Clinical Validation & Testing

### Vital Sign Accuracy Testing

![Reference Range and Recorded Data](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Reference%20range%20and%20Recorded%20Data%20of%20SPO2%2C%20heart%20rate%20and%20body%20Temperature%20.png?raw=true)
*Figure 20: Comparison of reference clinical ranges with recorded SwastyaSeva measurements for SpO₂, heart rate, and body temperature across test subjects.*

![Comparison of Vitals - Different Persons](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Comparison%20of%20Vitals%20of%20Different%20persons%20with%20different%20weights%20(same%20age)%20.png?raw=true)
*Figure 21: Comparative analysis showing vital signs of different test subjects with varying body weights and compositions.*

### Performance Analysis Graphs

![Heart Rate & SpO2 Comparative Analysis](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Heart%20rate%20%26%20SpO2-%20comparative%20analysis.png?raw=true)
*Figure 22: Correlation analysis between SwastyaSeva measurements and certified medical-grade pulse oximeter readings (R² = 0.98).*

![Blood Pressure Comparative Analysis](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Blood%20Pressure-%20comparative%20analysis.png?raw=true)
*Figure 23: Blood pressure estimation accuracy validation comparing wristband-derived values with reference sphygmomanometer readings.*

![Body Temperature Comparative Analysis](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Body%20Temperature-%20comparative%20analysis%20.png?raw=true)
*Figure 24: Temperature sensor accuracy showing ±1.5°C deviation from clinical reference thermometers.*

![Effect on Asthma Subjects - Comparative Analysis](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Effect%20on%20Asthma%20Subjects-%20comparative%20analysis.png?raw=true)
*Figure 25: Specialized testing with asthma patients demonstrating system's ability to detect respiratory distress through SpO₂ drops and elevated heart rate patterns.*

---

## Physical Hardware Implementation

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m 'Add your feature'`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request with a detailed description

### Guidelines
- Write clear, descriptive commit messages
- Test your changes thoroughly
- Update documentation if needed
- Follow the existing code style

---

## Physical Hardware Implementation

### Wristband Development & Testing

![Breadboard Testing](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Bread-Board-Testing-1.jpeg?raw=true)
*Figure 26: Breadboard prototype testing of wristband components showing ESP32-C3, MAX30102 biosensor, and MAX30205 temperature sensor interconnects.*

![Veroboard Development Process](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Varrow-Board%20Dev%20Process.jpeg?raw=true)
*Figure 27: Veroboard assembly process for the wristband PCB, showing component placement and soldering work.*

![Veroboard Testing](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Varrow-Board%20Dev%20Testing.jpeg?raw=true)
*Figure 28: Functional testing of the assembled Veroboard wristband prototype with multimeter verification and serial monitor debugging.*

### Complete System Hardware

![Vital Measurement Wristband](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Vital%20Measurement%20Wristband.jpg?raw=true)
*Figure 29: Final assembled smart wristband with silicone strap, embedded XIAO ESP32-C3, MAX30102 optical biosensor, and OLED display on the wrist surface.*

![Human Density Measurement System (mmWave Radar)](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Human%20Density%20Measurement%20System.jpg?raw=true)
*Figure 30: HLK LD2410B mmWave radar module mounted for occupancy detection, showing compact form factor suitable for ceiling-mounted deployment.*

![ESP32 Ward Gateway](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/ESP32%20Gateway.jpg?raw=true)
*Figure 31: ESP32-WROOM-32 Ward Gateway with status LEDs and power supply module, designed for wall or ceiling mounting in hospital wards.*

**System Integration:** The complete SwastyaSeva system integrates wristbands (Figure 29), mmWave radar occupancy sensors (Figure 30), and a centralized Ward Gateway (Figure 31) that aggregates all real-time data and transmits it to the cloud backend for dashboard visualization and alert escalation.

---

## Web Dashboard & User Interface

SwastyaSeva provides comprehensive web-based interfaces for both patients and hospital administrators. The dashboard is built with React and integrates real-time WebSocket updates for live vital sign monitoring.

### Authentication & User Access

![Website Login Page](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Website%20Login%20page.png?raw=true)
*Figure 8: Secure login interface with role-based authentication. Users can access as Patient, Doctor, Nurse, or Administrator.*

![Website State Choose Page](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Website%20State%20Choose%20page.png?raw=true)
*Figure 9: Role selection interface for users with multiple access roles.*

### Patient Portal

![User Starting Page](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/User%20Starting%20page.png?raw=true)
*Figure 10: Patient dashboard landing page with quick access to vital information.*

![User Dashboard](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/User%20Dashboard.png?raw=true)
*Figure 11: Real-time patient dashboard showing current vital signs with status indicators.*

![User Vitals Graph](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/User%20Vitals%20Graph.png?raw=true)
*Figure 12: 24-hour vital sign trend visualization showing heart rate, SpO₂, and temperature over time.*

![Booking Appointment](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Booking%20Appointment.png?raw=true)
*Figure 13: Appointment scheduling interface for patients to book consultations with doctors.*

![Hospital Directions with Google Maps](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Hospital%20Directions%20linked%20with%20Google%20maps.png?raw=true)
*Figure 14: Hospital location and directions integrated with Google Maps for patient navigation.*

![User Profile](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/User%20Profile.png?raw=true)
*Figure 15: Patient profile page showing personal information, medical history, and emergency contacts.*

### Administrator Dashboard

![Administrator Dashboard](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Administrator%20Dashboard.png?raw=true)
*Figure 16: Comprehensive admin dashboard showing all active patients, their vital signs in real-time, and system status.*

![Administrator's Doctor Management](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Administrator%E2%80%99s%20Doctor%20Management.png?raw=true)
*Figure 17: Doctor and staff management interface for scheduling, assignments, and performance tracking.*

![Administrator's Analytics of Patient Monitoring](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Administrator%E2%80%99s%20Analytics%20of%20Patient%20Monitoring.png?raw=true)
*Figure 18: Advanced analytics dashboard showing patient monitoring trends, occupancy patterns, and predictive health metrics.*

![Ward Occupancy Monitoring](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Ward%20Occupancy%20monitoring.png?raw=true)
*Figure 19: Real-time ward occupancy visualization powered by mmWave radar, showing patient density per zone.*

---

## Clinical Validation & Testing

### Vital Sign Accuracy Testing

![Reference Range and Recorded Data](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Reference%20range%20and%20Recorded%20Data%20of%20SPO2%2C%20heart%20rate%20and%20body%20Temperature%20.png?raw=true)
*Figure 20: Comparison of reference clinical ranges with recorded SwastyaSeva measurements for SpO₂, heart rate, and body temperature across test subjects.*

![Comparison of Vitals - Different Persons](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Comparison%20of%20Vitals%20of%20Different%20persons%20with%20different%20weights%20(same%20age)%20.png?raw=true)
*Figure 21: Comparative analysis showing vital signs of different test subjects with varying body weights and compositions.*

### Performance Analysis Graphs

![Heart Rate & SpO2 Comparative Analysis](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Heart%20rate%20%26%20SpO2-%20comparative%20analysis.png?raw=true)
*Figure 22: Correlation analysis between SwastyaSeva measurements and certified medical-grade pulse oximeter readings (R² = 0.98).*

![Blood Pressure Comparative Analysis](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Blood%20Pressure-%20comparative%20analysis.png?raw=true)
*Figure 23: Blood pressure estimation accuracy validation comparing wristband-derived values with reference sphygmomanometer readings.*

![Body Temperature Comparative Analysis](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Body%20Temperature-%20comparative%20analysis%20.png?raw=true)
*Figure 24: Temperature sensor accuracy showing ±1.5°C deviation from clinical reference thermometers.*

![Effect on Asthma Subjects - Comparative Analysis](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Effect%20on%20Asthma%20Subjects-%20comparative%20analysis.png?raw=true)
*Figure 25: Specialized testing with asthma patients demonstrating system's ability to detect respiratory distress through SpO₂ drops and elevated heart rate patterns.*

---

### Backend Connection Issues
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Verify MongoDB connection
# Check MONGODB_URI in .env
```

### WebSocket Connection Failed
```bash
# Ensure WebSocket port is open (5001)
# Check firewall settings
# Verify CORS configuration
```

### ESP32 Firmware Upload Fails
```bash
# Try resetting ESP32: Hold BOOT + EN buttons
# Select "ESP32 Dev Module" board
# Check USB driver installation
```

### React Frontend Won't Start
```bash
# Clear cache and node_modules
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## Performance Optimization

### Backend
- Database indexing on frequently queried fields
- Connection pooling for MongoDB
- Gzip compression enabled
- Helmet.js security headers

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Memoization for expensive components
- Service workers for offline support

### IoT
- Sensor data buffering to reduce transmission frequency
- Exponential backoff for failed WiFi connections
- Local data logging on ESP32 during disconnections

---

## Security Considerations

1. **Authentication**: JWT tokens with 7-day expiry
2. **Password Security**: bcryptjs hashing with salt rounds = 10
3. **Data Encryption**: HTTPS/WSS for all communications
4. **SQL Injection**: Mongoose prevents via schema validation
5. **CORS**: Restrict to authorized domains only
6. **Rate Limiting**: Implement on sensitive endpoints (coming soon)
7. **Input Validation**: express-validator on all endpoints

---

## Future Enhancements

- [ ] Mobile app (React Native) for on-the-go access
- [ ] Advanced analytics and ML-based health predictions
- [ ] Integration with pharmacy and billing systems
- [ ] Multi-language support
- [ ] SMS/Email notifications for critical alerts
- [ ] Audit logging for compliance
- [ ] Advanced reporting and data export
- [ ] Telemedicine capabilities
- [ ] Integration with public health authorities

---

## License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) file for details.

---

## Support

For issues, questions, or suggestions:
- **Open an Issue** on GitHub
- **Email**: soumya.dev.nayak@gmail.com
- **LinkedIn**: [Soumya Dev Nayak](https://linkedin.com/in/soumya-dev-nayak)

---

## Acknowledgments

SwastyaSeva was developed as a comprehensive solution to improve healthcare delivery and patient safety. Special thanks to:
- The open-source community for excellent libraries and tools
- Healthcare professionals for invaluable feedback on features
- MongoDB and Render.com for robust hosting solutions

---

## Clinical Validation & Performance Metrics

### Vital Sign Accuracy

**Testing Setup:**
- 10 test subjects (ages 18-65, varying BMI)
- Continuous 1-hour monitoring sessions
- Reference device: Masimo Rad-5 clinical pulse oximeter
- Comparison metrics: Heart rate (BPM), SpO₂ (%), Blood pressure (estimated), Temperature

**Results Summary:**

| Metric | SwastyaSeva | Reference Device | Accuracy | Correlation |
|--------|-------------|------------------|----------|-------------|
| **SpO₂ Measurement** | 96-98% | 96-99% | ±2% | R² = 0.98 (98%) |
| **Heart Rate (BPM)** | 71 ± 3 | 72 ± 2 | 86% accuracy | σ = 2.1 bpm |
| **Temperature** | 37.2°C | 37.1°C | ±1.5°C | Linear fit |
| **Blood Pressure (Est.)** | 118/76 mmHg | 120/78 mmHg | ~90% | Estimated algorithm |

**Fatigue Detection Index** (novel derived metric):
- Computed from PPG signal morphology
- Detects elevated vasodilation in tired subjects
- Validated on 8-hour hospital shift monitoring
- Sensitivity: 87%, Specificity: 84%

### Wireless Communication Performance

**Network Test Conditions:**
- Ward environment (10m × 8m room, gypsum walls)
- 5 concurrent wristband nodes + 2 radar units
- Gateway at ceiling center, 2.5m height
- Multiple re-test scenarios: LoS, through-wall, crowded

**Results:**

| Test Scenario | Packet Delivery Rate | Latency (ms) | Remarks |
|---------------|---------------------|--------------|---------|
| **Line-of-Sight (LoS)** | 99.2% | 3.2 ± 0.8 | Excellent |
| **Single Wall** | 97.1% | 4.1 ± 1.2 | Through gypsum partition |
| **Double Wall** | 94.3% | 5.8 ± 1.5 | Degraded but acceptable |
| **Crowded Ward (10 people)** | 96.8% | 4.5 ± 1.1 | Multi-path interference |
| **Alert Packet (Priority)** | 99.8% | 2.1 ± 0.7 | Max retries enabled |

### System Latency Profile (End-to-End)

```
Measurement         Latency Component           Typical Value
─────────────────────────────────────────────────────────────
Sensor Sampling     MAX30102 + MAX30205        100 ms
Signal Processing  Moving average + filtering  10 ms
Computation        HR/SpO₂ extraction          5 ms
JSON Assembly      Packet formation            2 ms
ESP-NOW TX         Wireless transmission       < 5 ms (local)
Gateway RX         Reception + buffering       5 ms
HTTP Upload        WiFi + server processing    50-100 ms
Database Write     MongoDB insertion           10-20 ms
WebSocket Broadcast Real-time fan-out          20-50 ms
React Update       Component re-render         50-100 ms
─────────────────────────────────────────────────────────────
TOTAL LATENCY      Normal Data                 ~340 ms
TOTAL LATENCY      Priority Alert (bypass)     ~200 ms
```

### mmWave Radar Occupancy Detection

**Test Scenario:** Ward room 10m × 8m × 3m (height), gypsum walls

| Number of Occupants | Radar Detection | Accuracy | False Positives |
|---------------------|-----------------|----------|-----------------|
| 0 (Empty) | 0 | 100% | 0% |
| 1 (Stationary) | 1 | 100% | 0% |
| 1 (Moving) | 1 | 100% | 0% |
| 2 (Mixed) | 2 | 98% | 0.1% |
| 4 (Group) | 4 | 92% | 0.5% |
| 6+ (Crowded) | 5-6 | 85% | 1-2% |

**Latency:** Occupancy updates every 1 second
**Power Consumption:** 90mA @ 5V (450mW continuous)
**Privacy Compliance:** ✅ No imaging, no identifiable features

---

## Authors & Contributors

### Project Lead & Full-Stack Developer
**Soumya Dev Nayak** (23BECF35)  
- Full-stack system architecture (hardware, firmware, backend, frontend)
- IoT & wireless protocol design
- Backend API & WebSocket implementation
- React dashboard development
- Project documentation

B.Tech Electronics & Communication Engineering | Silicon University (Graduating 2027)  
[GitHub: soumya-dev-nayak](https://github.com/soumya-dev-nayak) | [LinkedIn](https://linkedin.com/in/soumya-dev-nayak)

### Contributing Team Members
**Subhasis Chakravarty** (23BECF44) | **C S Vishal Rout** (23BECD05) | **Sushree Pratyusha Sahoo** (23BECA48) | **Aditi Patel** (23BECD59)  
- Hardware integration and testing
- Sensor calibration and firmware tuning
- Clinical validation and performance analysis
- User interface feedback and refinement

### Project Advisor
**Dr. Sudhansu Mohan Biswal**  
Associate Professor, Department of Electronics and Communication Engineering  
Silicon University, Bhubaneswar

**Dr. Sudhansu Kumar Pati**  
Head of Department, Electronics and Communication Engineering  
Silicon University, Bhubaneswar

---

## Acknowledgments

We extend our heartfelt gratitude to:

- **Dr. Sudhansu Mohan Biswal** for his invaluable guidance, technical expertise, and encouragement throughout the project lifecycle
- **Dr. Sudhansu Kumar Pati** (H.O.D.) for providing laboratory facilities and resources
- The **Silicon University ECE Department** for supporting innovation and hands-on learning
- **Espressif Systems** for exceptional documentation and open-source ESP-IDF framework
- **Maxim Integrated (Analog Devices)** for clinical-grade sensor datasheets and application notes
- **Mongoose.js** and **MongoDB** communities for robust database libraries
- **The Open-Source Community** (Arduino, React, Node.js) for democratizing IoT and web development
- Our families for their unwavering support and encouragement

---

<div align="center">

## 🏥 **Made with ❤️ for Better Healthcare Delivery**

**"Swasthya Sewa Satya Seva" — True service to health is service to humanity.**

If this project helps you build better patient monitoring systems, please consider **giving it a star** ⭐ and contributing back to the community!

**Questions? Feedback? Deployment Support?**  
Open an issue on GitHub or reach out directly.

**Follow for updates:** GitHub [@soumya-dev-nayak](https://github.com/soumya-dev-nayak)

</div>
