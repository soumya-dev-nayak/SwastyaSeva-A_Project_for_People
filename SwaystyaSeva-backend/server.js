require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const connectDB = require('./config/db');
const { initWebSocket } = require('./config/websocket');
const { startSimulation, stopAllSimulations } = require('./services/wsService');
const errorHandler = require('./middleware/errorHandler');

const PORT = process.env.PORT || 4000;
const app = express();

const corsOptions = {
  origin: '*',
  credentials: false,
  methods: ['GET','POST','PATCH','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','ngrok-skip-browser-warning'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

const uploadsDir = path.resolve(process.env.UPLOAD_PATH || './uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Routes
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/vitals',       require('./routes/vitals'));
app.use('/api/hospitals',    require('./routes/hospitals'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/doctors',      require('./routes/doctors'));
app.use('/api/patients',     require('./routes/patients'));
app.use('/api/wards',        require('./routes/wards'));
app.use('/api/reports',      require('./routes/reports'));
app.use('/api/history',      require('./routes/history'));
app.use('/api/analytics',    require('./routes/analytics'));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'SwastyaSeva HMS API running.', version: '2.0.0', timestamp: new Date().toISOString() }));
app.use((req, res) => res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found.` }));
app.use(errorHandler);

const server = http.createServer(app);
initWebSocket(server);

const start = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║     SwastyaSeva HMS — API Server v2.0 🏥         ║');
    console.log('╠══════════════════════════════════════════════════╣');
    console.log(`║  REST  →  http://localhost:${PORT}                   ║`);
    console.log(`║  WS    →  ws://localhost:${PORT}                     ║`);
    console.log('╠══════════════════════════════════════════════════╣');
    console.log('║  /api/auth/login  /api/hospitals  /api/doctors   ║');
    console.log('║  /api/vitals      /api/appointments /api/wards   ║');
    console.log('║  /api/analytics   /api/reports    /api/history   ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log('');
    // Start simulation for demo patients
    ['SW-4821','SW-4822','SW-4823','SW-4824','SW-4825','SW-4826'].forEach(pid => startSimulation(pid));
    console.log('[SIM] Auto-simulation started for all demo patients');
    console.log('');
  });
};

start().catch(err => { console.error('Failed to start:', err); process.exit(1); });

const shutdown = async (sig) => {
  console.log(`\n[${sig}] Shutting down...`);
  stopAllSimulations();
  server.close(async () => {
    const mongoose = require('mongoose');
    await mongoose.disconnect();
    console.log('Goodbye.');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('uncaughtException', err => { console.error('Uncaught:', err); shutdown('uncaughtException'); });
process.on('unhandledRejection', reason => console.error('Unhandled rejection:', reason));

module.exports = { app, server };
