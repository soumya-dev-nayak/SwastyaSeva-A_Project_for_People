# SwastyaSeva (A Project for People) - Hospital Management System with IoT Integration

> A comprehensive full-stack healthcare platform combining real-time patient monitoring via ESP32 IoT wearables, a Node.js/Express backend, React frontend, and MongoDB database for seamless hospital operations.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![Node.js](https://img.shields.io/badge/Node.js->=18.0.0-brightgreen)
![React](https://img.shields.io/badge/React-18.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)
![ESP32](https://img.shields.io/badge/ESP32-Arduino-red)

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

**SwastyaSeva** (Sanskrit: स्वास्थ्य = health, सेवा = service) is an integrated Hospital Management System designed to streamline patient care, staff coordination, and real-time health monitoring. The system combines:

- **Web-based Dashboard**: Intuitive React interface for hospital administrators, doctors, and nursing staff
- **IoT Wearables**: ESP32-powered wristwatch monitoring patient vitals in real-time
- **Robust Backend**: Node.js/Express API with WebSocket support for live data streaming
- **Scalable Database**: MongoDB for storing patient records, medical history, and analytics
- **Cloud Deployment**: Vercel (frontend) and Render.com (backend) for production reliability

This project was developed as a comprehensive solution for modern healthcare delivery, emphasizing patient safety and operational efficiency.

---

## Key Features

### 🏥 Patient Management
- **Patient Registration & Profiles**: Comprehensive medical history and demographic tracking
- **Medical Records**: Centralized storage of diagnoses, treatments, and prescriptions
- **Appointment Scheduling**: Streamlined doctor-patient scheduling system
- **Admission Management**: Track hospital stays, discharges, and bed allocation

### 📊 Real-Time Monitoring
- **Live Vitals Tracking**: Receive continuous heart rate, blood pressure, SpO2, and temperature readings from IoT wearables
- **Alert System**: Automatic alerts when patient vitals exceed safe thresholds
- **Historical Analytics**: Visualize patient health trends over time
- **WebSocket Integration**: Sub-second latency data streaming for critical monitoring

### 👨‍⚕️ Staff Management
- **User Roles**: Admin, Doctor, Nurse, Receptionist with role-based access control
- **Task Assignment**: Delegate and track nursing tasks and follow-ups
- **Schedule Management**: Hospital staff shift scheduling and availability

### 🔐 Security & Compliance
- **JWT Authentication**: Secure login with token-based sessions
- **Password Hashing**: bcryptjs for secure credential storage
- **Data Encryption**: HTTPS/WSS for all communications
- **HIPAA-Aligned Design**: Structure supports healthcare data protection standards

### ⚙️ Backend Features
- **RESTful API**: Complete endpoints for all hospital operations
- **Input Validation**: express-validator for data integrity
- **Error Handling**: Comprehensive error responses and logging via Morgan
- **CORS Support**: Secure cross-origin requests
- **Compression**: gzip middleware for optimized data transfer
- **Security Headers**: Helmet.js for protection against common vulnerabilities

---

## Project Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                      SwastyaSeva Ecosystem                       │
└──────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │   React Web UI  │ (Vercel)
                    │  hospital-api   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  WebSocket/HTTP │
                    │   Connection    │
                    └────────┬────────┘
                             │
    ┌────────────────────────┼────────────────────────┐
    │                        │                        │
┌───▼───────────────┐  ┌──────▼──────┐  ┌─────────────▼─────┐
│ ESP32 Wristwatch  │  │   Backend   │  │   MongoDB Atlas   │
│  IoT Monitoring   │  │ (Express.js)│  │   Cloud Database  │
│  - Heart Rate     │  │ (Render.com)│  │                   │
│  - Blood Pressure │  └─────────────┘  └───────────────────┘
│  - SpO2           │
│  - Temperature    │
└───────────────────┘

Data Flow:
1. ESP32 reads vitals every 5-10 seconds
2. Sends data via WiFi to backend
3. Backend validates and stores in MongoDB
4. WebSocket broadcasts live updates to all connected clients
5. React dashboard updates in real-time
```

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.x | UI framework and state management |
| Axios | Latest | HTTP client for API calls |
| Socket.IO Client | Latest | WebSocket connection for live updates |
| CSS/Bootstrap | Latest | Styling and responsive design |
| Deployment | Vercel | Serverless hosting and auto-scaling |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | >=18.0.0 | Runtime environment |
| Express.js | 4.18.2 | Web framework and routing |
| MongoDB | Latest | NoSQL database |
| Mongoose | 7.6.3 | ODM for MongoDB |
| WebSocket (ws) | 8.16.0 | Real-time bidirectional communication |
| JWT | 9.0.2 | Authentication and authorization |
| bcryptjs | 2.4.3 | Password hashing and security |
| Helmet | 7.1.0 | HTTP headers security |
| Morgan | 1.10.0 | Request logging |
| Deployment | Render.com | Container-based backend hosting |

### IoT & Hardware
| Technology | Purpose |
|-----------|---------|
| ESP32 | Microcontroller for wearable sensors |
| Arduino IDE | Firmware development |
| WiFi Module (Built-in) | Wireless connectivity |
| Sensors | Heart rate, blood pressure, SpO2, temperature |

### Database
| Service | Purpose |
|---------|---------|
| MongoDB Atlas | Cloud-hosted production database |
| Mongoose Schemas | Data modeling and validation |

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

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **MongoDB Atlas** account ([Sign up free](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))
- **Arduino IDE** (for ESP32 firmware development) ([Download](https://www.arduino.cc/))

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

## Real-Time Monitoring

### WebSocket Connection

The backend maintains WebSocket connections for live vitals streaming:

```javascript
// Frontend connection
const socket = io('wss://backend-domain.com', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

socket.on('vitals_update', (data) => {
  console.log(`Patient ${data.patientId}: HR=${data.heartRate}`);
  updateDashboard(data);
});
```

### Data Format

Vitals transmitted as JSON:
```json
{
  "patientId": "60a7f1b2c1d2e3f4g5h6i7j8",
  "timestamp": "2024-01-20T10:30:15.000Z",
  "vitals": {
    "heartRate": 72,
    "bloodPressure": {
      "systolic": 120,
      "diastolic": 80
    },
    "spO2": 98,
    "temperature": 37.2
  },
  "alerts": []
}
```

### Alert System

Automatic alerts trigger when vitals exceed thresholds:
- Heart Rate: < 50 or > 120 bpm
- Blood Pressure: Systolic < 90 or > 180 mmHg
- SpO2: < 95%
- Temperature: < 36 or > 39°C

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

## Troubleshooting

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

## Author

**Soumya Dev Nayak**  
B.Tech Electronics & Communication Engineering  
Silicon University (Graduating 2027)  
[GitHub](https://github.com/soumya-dev-nayak) | [LinkedIn](https://linkedin.com/in/soumya-dev-nayak)

---

<div align="center">

**Made with ❤️ for better healthcare**

⭐ **If this project helps you, please consider giving it a star!** ⭐

</div>
