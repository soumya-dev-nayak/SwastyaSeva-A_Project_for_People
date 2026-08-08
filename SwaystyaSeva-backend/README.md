# MediCore HMS — Backend API

Complete Node.js + Express + MongoDB backend for the MediCore Hospital Management System.

---

## Prerequisites

- Node.js v18+
- MongoDB running locally on port 27017
- (Optional) MongoDB Compass for GUI management

---

## Installation & Setup

### 1. Backend

```bash
cd medicore-backend
npm install
cp .env.example .env
# Edit .env if needed (default values work for local dev)
npm run seed        # Seed the database with demo data
npm run dev         # Start server with auto-reload on port 4000
# OR
npm start           # Start server without auto-reload
```

### 2. Frontend

```bash
cd hospital-hms
npm install
npm start           # Start React app on port 3000
```

Open `http://localhost:3000` in your browser.

---

## Demo Login Credentials

| Role    | Email                     | Password   |
|---------|---------------------------|------------|
| Admin   | admin@medicore.com        | admin123   |
| Patient | patient@medicore.com      | patient123 |

---

## API Endpoints Reference

### Auth
| Method | Endpoint              | Access  | Description              |
|--------|-----------------------|---------|--------------------------|
| POST   | /api/auth/register    | Public  | Register new user        |
| POST   | /api/auth/login       | Public  | Login, get JWT token     |
| POST   | /api/auth/refresh     | Public  | Refresh access token     |
| GET    | /api/auth/me          | Private | Get current user profile |
| POST   | /api/auth/logout      | Private | Logout                   |

### Vitals
| Method | Endpoint                        | Access         | Description               |
|--------|---------------------------------|----------------|---------------------------|
| POST   | /api/vitals                     | Public (IoT)   | Post sensor reading       |
| GET    | /api/vitals/:patientId          | Private        | Get latest vitals         |
| GET    | /api/vitals/:patientId/history  | Private        | Get history for charts    |
| DELETE | /api/vitals/:patientId/history  | Admin          | Clear vitals history      |

### Appointments
| Method | Endpoint                          | Access  | Description              |
|--------|-----------------------------------|---------|--------------------------|
| GET    | /api/appointments                 | Private | List appointments        |
| GET    | /api/appointments/:id             | Private | Get single appointment   |
| POST   | /api/appointments                 | Patient | Book appointment         |
| PATCH  | /api/appointments/:id/approve     | Admin   | Approve appointment      |
| PATCH  | /api/appointments/:id/reject      | Admin   | Reject appointment       |
| PATCH  | /api/appointments/:id/complete    | Admin   | Mark as completed        |
| DELETE | /api/appointments/:id             | Private | Delete appointment       |

### Doctors
| Method | Endpoint                          | Access  | Description              |
|--------|-----------------------------------|---------|--------------------------|
| GET    | /api/doctors                      | Private | List all doctors         |
| GET    | /api/doctors/:id                  | Private | Get single doctor        |
| GET    | /api/doctors/:id/schedule         | Private | Get doctor schedule      |
| POST   | /api/doctors                      | Admin   | Add doctor               |
| PATCH  | /api/doctors/:id                  | Admin   | Update doctor            |
| PATCH  | /api/doctors/:id/availability     | Admin   | Toggle availability      |
| DELETE | /api/doctors/:id                  | Admin   | Remove doctor            |

### Patients
| Method | Endpoint                          | Access         | Description              |
|--------|-----------------------------------|----------------|--------------------------|
| GET    | /api/patients                     | Admin          | List all patients        |
| GET    | /api/patients/me                  | Patient        | Own profile              |
| GET    | /api/patients/:patientId          | Owner/Admin    | Get patient profile      |
| GET    | /api/patients/:patientId/summary  | Owner/Admin    | Full summary             |
| PATCH  | /api/patients/:patientId          | Owner/Admin    | Update profile           |

### Wards
| Method | Endpoint                          | Access  | Description              |
|--------|-----------------------------------|---------|--------------------------|
| GET    | /api/wards                        | Private | List all wards           |
| GET    | /api/wards/summary                | Private | Totals summary           |
| GET    | /api/wards/:id                    | Private | Get single ward          |
| POST   | /api/wards                        | Admin   | Create ward              |
| PATCH  | /api/wards/:id                    | Admin   | Update ward              |
| PATCH  | /api/wards/:id/admit              | Admin   | Admit a patient          |
| PATCH  | /api/wards/:id/discharge          | Admin   | Discharge a patient      |

### Reports
| Method | Endpoint                          | Access      | Description              |
|--------|-----------------------------------|-------------|--------------------------|
| GET    | /api/reports/:patientId           | Owner/Admin | List reports             |
| POST   | /api/reports/upload/:patientId    | Owner/Admin | Upload report file       |
| GET    | /api/reports/file/:reportId       | Owner/Admin | View/download file       |
| DELETE | /api/reports/:reportId            | Owner/Admin | Delete report            |

### Medical History
| Method | Endpoint                          | Access      | Description              |
|--------|-----------------------------------|-------------|--------------------------|
| GET    | /api/history/:patientId           | Owner/Admin | List history             |
| GET    | /api/history/entry/:id            | Private     | Get entry                |
| POST   | /api/history/:patientId           | Admin       | Create entry             |
| PATCH  | /api/history/entry/:id            | Admin       | Update entry             |
| DELETE | /api/history/entry/:id            | Admin       | Delete entry             |

### Analytics
| Method | Endpoint                              | Access      | Description              |
|--------|---------------------------------------|-------------|--------------------------|
| GET    | /api/analytics/overview               | Admin       | Dashboard stats          |
| GET    | /api/analytics/weekly                 | Admin       | Weekly chart data        |
| GET    | /api/analytics/doctor-load            | Admin       | Doctor patient counts    |
| GET    | /api/analytics/kpis                   | Admin       | KPI metrics              |
| GET    | /api/analytics/vitals-trends/:pid     | Owner/Admin | Vitals trend data        |

---

## WebSocket Events

### Server → Client
| Type             | Description                                |
|------------------|--------------------------------------------|
| CONNECTED        | Sent on connect with welcome message       |
| VITALS_UPDATE    | New vitals reading (every 5s from sim)     |
| VITAL_ALERT      | Abnormal vitals detected                   |
| NEW_APPOINTMENT  | New appointment booked (sent to admins)    |
| APPT_STATUS      | Appointment approved/rejected (to patient) |
| WARD_UPDATE      | Ward bed count changed                     |
| NOTIFICATION     | General in-app notification                |
| PONG             | Response to client PING                    |
| SUBSCRIBED       | Confirms SUBSCRIBE registration            |

### Client → Server
| Type       | Payload                                 | Description            |
|------------|-----------------------------------------|------------------------|
| SUBSCRIBE  | { patientId, role }                     | Register client        |
| PING       | —                                       | Keepalive ping         |

---

## Sensor Integration (IoT / Arduino / Raspberry Pi)

Send POST request to your backend from any device:

```bash
curl -X POST http://localhost:4000/api/vitals \
     -H "Content-Type: application/json" \
     -d '{"patientId":"P-4821","hr":78,"spo2":97.5,"temp":36.9}'
```

**Python sensor example:**
```python
import requests, time, random

while True:
    requests.post('http://localhost:4000/api/vitals', json={
        'patientId': 'P-4821',
        'hr': random.randint(65, 95),
        'spo2': round(random.uniform(96, 99.5), 1),
        'temp': round(random.uniform(36.4, 37.2), 1),
    })
    time.sleep(5)
```

---

## Environment Variables

| Variable               | Default                                    | Description                   |
|------------------------|--------------------------------------------|-------------------------------|
| PORT                   | 4000                                       | Server port                   |
| MONGODB_URI            | mongodb://localhost:27017/medicore_hms     | MongoDB connection string     |
| JWT_SECRET             | (required in production)                   | JWT signing secret            |
| JWT_EXPIRES_IN         | 7d                                         | JWT token expiry              |
| JWT_REFRESH_SECRET     | (required in production)                   | Refresh token secret          |
| JWT_REFRESH_EXPIRES_IN | 30d                                        | Refresh token expiry          |
| UPLOAD_PATH            | ./uploads                                  | File upload directory         |
| MAX_FILE_SIZE          | 10485760                                   | Max upload size (bytes = 10MB)|
| NODE_ENV               | development                                | Environment mode              |
| CORS_ORIGIN            | http://localhost:3000                      | Frontend URL for CORS         |

---

## Project Structure

```
medicore-backend/
├── server.js               Main entry point
├── package.json
├── .env.example
├── config/
│   ├── db.js               MongoDB connection with retry
│   ├── jwt.js              JWT sign/verify helpers
│   └── websocket.js        WebSocket server + broadcast
├── models/                 Mongoose schemas
│   ├── User.js
│   ├── Doctor.js
│   ├── Patient.js
│   ├── Appointment.js
│   ├── Vitals.js
│   ├── Ward.js
│   ├── Report.js
│   └── MedicalHistory.js
├── controllers/            Route handlers
├── routes/                 Express routers
├── middleware/
│   ├── auth.js             JWT protect middleware
│   ├── role.js             Admin/patient/owner guards
│   ├── upload.js           Multer config
│   └── errorHandler.js     Global error handler
├── services/
│   ├── vitalsService.js    Vitals validation & alerts
│   ├── notificationService.js  WS notifications
│   └── wsService.js        Simulation & sensor tracking
├── seed/
│   └── seed.js             Database seeder
└── uploads/                Uploaded report files
```

---

## Troubleshooting

**MongoDB not connecting:**
```bash
sudo systemctl start mongod       # Linux
brew services start mongodb-community  # macOS
```

**Port 4000 already in use:**
```bash
lsof -i :4000
kill -9 <PID>
```

**Frontend shows "Simulated Data" instead of "Live Sensor":**
- Make sure `node server.js` is running in the backend folder
- Check the browser console for WebSocket errors
- Ensure no firewall is blocking port 4000

**Re-seed database (reset all data):**
```bash
npm run seed
```
