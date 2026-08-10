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

## 📖 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Hardware Specifications](#hardware-specifications)
- [Getting Started](#getting-started)
- [Web Dashboard](#web-dashboard)
- [Clinical Validation](#clinical-validation)
- [Physical Hardware](#physical-hardware)
- [Authors](#authors--contributors)
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
- **Continuous Multi-Parameter Monitoring**: Real-time heart rate (BPM), peripheral oxygen saturation (SpO₂), and core body temperature
- **Derived Diagnostic Parameters**: Onboard firmware algorithms compute estimated blood pressure and patient fatigue index
- **Multi-Modal Alerts**: Vibration motor + OLED visual alert + immediate WebSocket escalation (< 200ms)
- **Clinical Alert Thresholds**: Customizable thresholds for HR, SpO₂, temperature, and blood pressure

### 📍 Ward Occupancy & Environmental Monitoring
- **Privacy-Preserving mmWave Radar**: Real-time crowd density and patient motion detection without imaging
- **Non-Contact Detection**: Simultaneously detects moving and stationary individuals up to 6 meters away
- **HIPAA Compliance**: Cannot capture identifiable visual information
- **Zone-Based Monitoring**: Strategic deployment for bed management and capacity planning

### 🏥 Comprehensive Patient Management
- **Patient Registration & Profiles**: Demographic data, medical history, chronic conditions
- **Electronic Medical Records**: Centralized diagnoses, treatments, and medications
- **Appointment Scheduling**: Doctor-patient scheduling with automated reminders
- **Admission/Discharge Management**: Track hospital stays and bed allocation

### 📊 Real-Time Monitoring & Analytics
- **Live Dashboard**: WebSocket-driven real-time vital updates (340ms latency)
- **Historical Trend Analysis**: 24-hour vital sign charts; rolling averages
- **Critical Alert Audit Log**: Timestamped threshold exceedances with resolution tracking
- **Predictive Analytics Ready**: Architecture supports ML anomaly detection

### 👨‍⚕️ Role-Based Staff Management
- **Multi-Role Access Control**: Administrator, Doctor, Nurse, Patient, Family Member
- **Task Assignment & Tracking**: Delegate and monitor nursing tasks
- **Shift Scheduling**: Staff availability and rotation management
- **Real-Time Notifications**: Critical alerts pushed to assigned caregivers

### 🔐 Security & Healthcare Compliance
- **JWT Authentication**: Token-based login with 7-day expiry
- **Password Security**: bcryptjs hashing with 10 salt rounds
- **Data Encryption**: HTTPS/WSS for all communications
- **Input Validation**: express-validator on all API endpoints
- **HIPAA-Aligned Architecture**: Audit trails, secure transmission, data segregation

---

## System Architecture

### High-Level System Overview

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Conceptual%20Diagram%20of%20Overall%20System.png?raw=true" width="900">
</p>
<p align="center">
  <em>Figure 1: Conceptual Diagram of Overall System</em><br>
  <em>End-to-end SwastyaSeva ecosystem showing wearable sensor nodes, ward gateway aggregation, cloud analytics, and web dashboard integration</em>
</p>

### Integrated Patient Monitoring System

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Integrated%20patient%20monitoring%20system%20.png?raw=true" width="900">
</p>
<p align="center">
  <em>Figure 2: Integrated Patient Monitoring System</em><br>
  <em>Detailed multi-layer architecture showing patient wristbands, ward gateway, backend server, and real-time dashboard</em>
</p>

### Block Diagram: Component-Level Architecture

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Block%20Diagram%20of%20Patient%20Care%20System%20.png?raw=true" width="900">
</p>
<p align="center">
  <em>Figure 3: Block Diagram of Patient Care System</em><br>
  <em>Signal flow through each hardware component from sensors through microcontroller to wireless transmission</em>
</p>

### System Layers Overview

The SwastyaSeva architecture uses a hierarchical, multi-tiered approach:

- **TIER 1 - Sensing Layer**: XIAO ESP32-C3 wristbands with MAX30102 biosensor + MAX30205 temperature sensor
- **TIER 2 - Aggregation Layer**: ESP32-WROOM-32 Ward Gateway collecting data from multiple wristbands and radar modules
- **TIER 3 - Cloud & Analytics**: Node.js/Express backend with MongoDB Atlas time-series database
- **TIER 4 - Presentation**: React web dashboard with role-based access control

---

## Hardware Specifications & Wiring

### Wristband Circuit Diagram

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Detailed%20Circuit%20Diagram%20of%20the%20Wristband%20band%20system.png?raw=true" width="700">
</p>
<p align="center">
  <em>Figure 4: Detailed Circuit Diagram of the Wristband System</em><br>
  <em>I2C connections to MAX30102 optical biosensor and MAX30205 temperature sensor, OLED display, emergency button, and vibration motor</em>
</p>

### Power Supply Circuit

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/5V%20DC%20Power%20Supply%20CKT%20Diagram%20.png?raw=true" width="800">
</p>
<p align="center">
  <em>Figure 5: 5V DC Power Supply Circuit Diagram</em><br>
  <em>Regulated DC power for ESP32 Ward Gateway and mmWave radar using transformer-rectifier topology with 7805 linear regulator</em>
</p>

### Clinical Alert Thresholds

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Table-1%20Clinical%20Vital%20Sign%20Alert%20Thresholds%20.png?raw=true" width="700">
</p>
<p align="center">
  <em>Figure 6: Clinical Vital Sign Alert Thresholds</em><br>
  <em>Normal ranges and alert triggers for heart rate, SpO₂, body temperature, and blood pressure</em>
</p>

---

## Tech Stack

### Frontend (React Dashboard)
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.x | Component-based UI framework |
| Socket.IO Client | Latest | Real-time WebSocket for live vital streaming |
| Axios | Latest | HTTP client for RESTful API calls |
| Chart.js/Recharts | Latest | Vital trend visualization |
| Bootstrap/Tailwind | Latest | Responsive UI design |
| Vercel | — | Serverless deployment with auto-scaling |

### Backend (Node.js/Express)
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | >=18.0.0 | Runtime environment |
| Express.js | 4.18.2 | Web framework & HTTP routing |
| Socket.IO | Latest | Real-time WebSocket communication |
| Mongoose | 7.6.3 | MongoDB ODM for schema validation |
| MongoDB Atlas | Latest | Cloud time-series database |
| JWT (jsonwebtoken) | 9.0.2 | Token-based authentication |
| bcryptjs | 2.4.3 | Password hashing (10 salt rounds) |
| Helmet.js | 7.1.0 | HTTP header security |
| Render.com | — | Container-based backend hosting |

### IoT & Hardware Layer
| Component | Specification | Purpose |
|-----------|---------------|---------|
| **XIAO ESP32-C3** | RISC-V 160MHz, 4MB flash | Wristband processor |
| **MAX30102** | Optical biosensor (660nm + 880nm) | Heart rate & SpO₂ via PPG |
| **MAX30205** | 16-bit I2C temperature sensor | Clinical-grade body temperature |
| **HLK LD2410B** | 24GHz FMCW mmWave, 6m range | Privacy-preserving occupancy |
| **SSD1306 OLED** | 0.96" 128×64 I2C display | Wristband real-time vitals |
| **ESP32-WROOM-32** | Dual-core 240MHz | Ward gateway processor |
| **3.7V LiPo 900mAh** | — | Wristband power (8-12 hour runtime) |
| **5V DC Power Supply** | Regulated transformer-rectifier | Gateway & radar continuous power |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **MongoDB Atlas** account ([Free tier](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))
- **Arduino IDE** >= 1.8.19 (for ESP32 firmware) ([Download](https://www.arduino.cc/))
- **USB-C Cable** (for ESP32 programming)

### Backend Setup

```bash
git clone https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People.git
cd SwastyaSeva-A_Project_for_People/SwaystyaSeva-backend
npm install

# Create .env file
cat > .env << EOF
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/swastyaseva
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
WS_PORT=5001
EOF

npm run dev  # Backend runs at http://localhost:5000
```

### Frontend Setup

```bash
cd ../hospital-api
npm install

# Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5001
EOF

npm start  # Frontend runs at http://localhost:3000
```

### IoT Setup (ESP32)

1. Open `Wristwatch_Main_Code_ESP32.ino` in Arduino IDE
2. Install ESP32 board support via Board Manager
3. Update WiFi credentials and backend server IP
4. Select "ESP32 Dev Module" board and upload
5. Monitor via Serial Monitor at 115200 baud

---

## Web Dashboard & User Interface

### Patient Portal - Authentication

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/watermark-removed-Website%20Login%20page.png" width="700"></p>
<p align="center">
  <em>Figure 8: Website Login Page</em><br>
  <em>Secure login interface with role-based authentication for Patient, Doctor, Nurse, and Administrator</em>
</p>

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Website%20State%20Choose%20page.png?raw=true" width="700">
</p>
<p align="center">
  <em>Figure 9: Role Selection Interface</em><br>
  <em>Choose access role for users with multiple roles</em>
</p>

### Patient Dashboard

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/User%20Starting%20page.png?raw=true" width="700">
</p>
<p align="center">
  <em>Figure 10: Patient Starting Page</em><br>
  <em>Dashboard landing page with quick access to vital information</em>
</p>

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/User%20Dashboard.png?raw=true" width="700">
</p>
<p align="center">
  <em>Figure 11: Real-Time Patient Dashboard</em><br>
  <em>Current vital signs with color-coded status indicators</em>
</p>

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/User%20Vitals%20Graph.png?raw=true" width="700">
</p>
<p align="center">
  <em>Figure 12: 24-Hour Vital Sign Trends</em><br>
  <em>Historical visualization of heart rate, SpO₂, and temperature over 24 hours</em>
</p>

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Booking%20Appointment.png?raw=true" width="700">
</p>
<p align="center">
  <em>Figure 13: Appointment Scheduling</em><br>
  <em>Book consultations with doctors and medical staff</em>
</p>

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Hospital%20Directions%20linked%20with%20Google%20maps.png?raw=true" width="900">
</p>
<p align="center">
  <em>Figure 14: Hospital Directions & Navigation</em><br>
  <em>Google Maps integration for patient wayfinding</em>
</p>

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/User%20Profile.png?raw=true" width="700">
</p>
<p align="center">
  <em>Figure 15: Patient Profile</em><br>
  <em>Personal information, medical history, and emergency contacts</em>
</p>

### Administrator Dashboard

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Administrator%20Dashboard.png?raw=true" width="700">
</p>
<p align="center">
  <em>Figure 16: Administrator Dashboard</em><br>
  <em>Real-time overview of all active patients and system status</em>
</p>

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Administrator%E2%80%99s%20Doctor%20Management.png?raw=true" width="700">
</p>
<p align="center">
  <em>Figure 17: Doctor & Staff Management</em><br>
  <em>Schedule assignments and performance tracking</em>
</p>

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Administrator%E2%80%99s%20Analytics%20of%20Patient%20Monitoring.png?raw=true" width="900">
</p>
<p align="center">
  <em>Figure 18: Advanced Analytics Dashboard</em><br>
  <em>Patient monitoring trends, predictive health metrics, and occupancy patterns</em>
</p>

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Ward%20Occupancy%20monitoring.png?raw=true" width="700">
</p>
<p align="center">
  <em>Figure 19: Ward Occupancy Monitoring</em><br>
  <em>Real-time occupancy powered by mmWave radar showing patient density per zone</em>
</p>

---

## Clinical Validation & Performance

### Vital Sign Accuracy

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Reference%20range%20and%20Recorded%20Data%20of%20SPO2%2C%20heart%20rate%20and%20body%20Temperature%20.png?raw=true" width="800">
</p>
<p align="center">
  <em>Figure 20: Reference Ranges vs. Recorded Data</em><br>
  <em>Clinical reference ranges compared with SwastyaSeva measurements across test subjects</em>
</p>

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Comparison%20of%20Vitals%20of%20Different%20persons%20with%20different%20weights%20(same%20age)%20.png?raw=true" width="600">
</p>
<p align="center">
  <em>Figure 21: Vital Signs Comparison - Different Body Weights</em><br>
  <em>Comparative analysis of subjects with varying BMI and compositions</em>
</p>

### Performance Analysis Graphs

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Heart%20rate%20%26%20SpO2-%20comparative%20analysis.png?raw=true" width="1000">
</p>
<p align="center">
  <em>Figure 22: Heart Rate & SpO₂ Correlation Analysis</em><br>
  <em>R² = 0.98 correlation with certified Masimo Rad-5 reference device</em>
</p>

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Blood%20Pressure-%20comparative%20analysis.png?raw=true" width="1000">
</p>
<p align="center">
  <em>Figure 23: Blood Pressure Estimation Accuracy</em><br>
  <em>Wristband-derived BP vs. reference sphygmomanometer readings</em>
</p>

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Body%20Temperature-%20comparative%20analysis%20.png?raw=true" width="800">
</p>
<p align="center">
  <em>Figure 24: Temperature Sensor Accuracy</em><br>
  <em>±1.5°C deviation from clinical reference thermometers</em>
</p>

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Effect%20on%20Asthma%20Subjects-%20comparative%20analysis.png?raw=true" width="1000">
</p>
<p align="center">
  <em>Figure 25: Specialized Testing - Asthma Patients</em><br>
  <em>System's ability to detect respiratory distress through SpO₂ drops and elevated heart rate</em>
</p>

### Performance Metrics

| Metric | Result | Reference |
|--------|--------|-----------|
| SpO₂ Accuracy | ±2% | Masimo Rad-5 |
| Heart Rate | 86% | ±2.1 bpm |
| Temperature | ±1.5°C | Clinical thermometer |
| Packet Delivery Rate (LoS) | 99.2% | ESP-NOW |
| Packet Delivery Rate (Wall) | 97.1% | Through gypsum |
| End-to-End Latency (Normal) | 340ms | Measurement→Display |
| Alert Escalation Latency | <200ms | Measurement→Notification |
| Radar Occupancy Accuracy | 85-92% | 0-8 persons |

---

## Physical Hardware Implementation

### Wristband Development & Assembly

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Bread-Board-Testing-1.jpeg?raw=true" width="700" style="transform: rotate(270deg);">
</p>
<p align="center">
  <em>Figure 26: Breadboard Prototype Testing</em><br>
  <em>Component testing with ESP32-C3, MAX30102 biosensor, and MAX30205 temperature sensor</em>
</p>


<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Varrow-Board%20Dev%20Process.jpeg?raw=true" width="500">
</p>
<p align="center">
  <em>Figure 27: Veroboard Assembly Process</em><br>
  <em>PCB construction showing component placement and soldering</em>
</p>

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Varrow-Board%20Dev%20Testing.jpeg?raw=true" width="800">
</p>
<p align="center">
  <em>Figure 28: Functional Testing of Veroboard Wristband</em><br>
  <em>Multimeter verification and serial monitor debugging</em>
</p>

### Complete System Hardware

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Vital%20Measurement%20Wristband.jpg?raw=true" width="800">
</p>
<p align="center">
  <em>Figure 29: Final Assembled Smart Wristband</em><br>
  <em>Silicone strap with embedded XIAO ESP32-C3, MAX30102 optical biosensor, and OLED display</em>
</p>

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Human%20Density%20Measurement%20System.jpg?raw=true" width="500">
</p>
<p align="center">
  <em>Figure 30: mmWave Radar Occupancy Sensor</em><br>
  <em>HLK LD2410B module for ceiling-mounted deployment</em>
</p>

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/ESP32%20Gateway.jpg?raw=true" width="500">
</p>
<p align="center">
  <em>Figure 31: ESP32 Ward Gateway</em><br>
  <em>Central aggregation hub with status LEDs and power supply module for wall/ceiling mounting</em>
</p>

### System Integration

The complete SwastyaSeva system integrates:
- **Wristband (Fig 29)**: Continuous patient monitoring
- **mmWave Radar (Fig 30)**: Ward occupancy detection  
- **Ward Gateway (Fig 31)**: Data aggregation and transmission

---

## Firmware Algorithm & Data Processing

<p align="center">
  <img src="https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/blob/main/pics/Flow%20Chart%20of%20Data%20Processing%20and%20Actuation%20.svg?raw=true" width="800">
</p>
<p align="center">
  <em>Figure 7: Firmware Algorithm Flowchart</em><br>
  <em>Data acquisition, processing, threshold checking, alert actuation, and wireless transmission on XIAO ESP32-C3</em>
</p>

**5-Second Monitoring Cycle:**
1. MAX30102: Acquire 100 PPG samples @ 100 Hz
2. Signal Processing: Moving average + noise filtering
3. Computation: Extract HR (BPM) & SpO₂ (%) from R-ratio
4. MAX30205: Read temperature via I2C (50ms conversion)
5. Threshold Check: Compare vitals against clinical limits
6. JSON Assembly: Create data packet with MAC address + timestamp
7. ESP-NOW Broadcast: Transmit to Ward Gateway (< 5ms)
8. Light Sleep: ESP32-C3 enters ultra-low-power mode (~1mA)

---

## Contributing

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

## Deployment

### Backend (Render.com)
1. Create Render account
2. Connect GitHub repository
3. Create Web Service with environment variables
4. Auto-deploys on git push

### Frontend (Vercel)
1. Create Vercel account
2. Import project from GitHub
3. Set environment variables
4. Auto-deploys on git push

### Database (MongoDB Atlas)
1. Create free cluster
2. Get connection string
3. Whitelist deployment server IPs

---

## Troubleshooting

```bash
# Backend connection issues
curl http://localhost:5000/api/health

# WebSocket connection failed
# Ensure port 5001 is open; check firewall & CORS

# ESP32 firmware upload fails
# Hold BOOT + EN buttons; check USB driver

# React frontend won't start
rm -rf node_modules package-lock.json
npm install && npm start
```

---

## Future Enhancements

- [ ] Mobile app (React Native) for on-the-go access
- [ ] ML-based health prediction (LSTM anomaly detection)
- [ ] Multi-ward mesh topology for hospital-wide deployment
- [ ] SMS/Email notifications for critical alerts
- [ ] Telemedicine capabilities
- [ ] Integration with pharmacy & billing systems

---

## Authors & Contributors

### Project Lead & Full-Stack Developer
**Soumya Dev Nayak** (23BECF35)  
Full-stack system architecture (hardware, firmware, backend, frontend)  
B.Tech Electronics & Communication Engineering | Silicon University (Graduating 2027)  
[GitHub: soumya-dev-nayak](https://github.com/soumya-dev-nayak)

### Contributing Team Members
* Subhasis Chakravarty      (23BECF44) |  C S Vishal Rout  (23BECD05)  
* Sushree Pratyusha Sahoo   (23BECA48) |  Aditi Patel      (23BECD59)
---

## License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) file for details.

---

<div align="center">

## 🏥 **Made with ❤️ for Better Healthcare Delivery**

**"Swasthya Sewa Satya Seva" — True service to health is service to humanity.**

If this project helps you build better patient monitoring systems, please consider giving it a star ⭐

**Questions? Feedback? Collaboration?**  
[Open an Issue](https://github.com/soumya-dev-nayak/SwastyaSeva-A_Project_for_People/issues) | [Email](mailto:soumya.dev.nayak8@gmail.com)

</div>
