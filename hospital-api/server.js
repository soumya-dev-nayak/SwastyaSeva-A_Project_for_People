const express = require('express');
const cors    = require('cors');
const WebSocket = require('ws');
const http    = require('http');

const app    = express();
const server = http.createServer(app);
const wss    = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

// ── In-memory store (replace with MongoDB later) ──
let latestVitals = { hr: 72, spo2: 98.0, temp: 36.8, timestamp: Date.now() };

// ── REST endpoint: sensor posts data here ──
app.post('/api/vitals', (req, res) => {
  const { hr, spo2, temp, patientId } = req.body;

  // Validate incoming data
  if (!hr || !spo2 || !temp) {
    return res.status(400).json({ error: 'Missing vitals data' });
  }

  latestVitals = { hr, spo2, temp, patientId, timestamp: Date.now() };

  // Broadcast to all connected WebSocket clients instantly
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'VITALS_UPDATE', data: latestVitals }));
    }
  });

  res.json({ success: true, received: latestVitals });
});

// ── REST endpoint: frontend can also poll this ──
app.get('/api/vitals/:patientId', (req, res) => {
  res.json(latestVitals);
});

// ── WebSocket connection handler ──
wss.on('connection', (ws) => {
  console.log('Dashboard connected via WebSocket');
  // Send current vitals immediately on connect
  ws.send(JSON.stringify({ type: 'VITALS_UPDATE', data: latestVitals }));
});

server.listen(4000, () => console.log('API running on http://localhost:4000'));
