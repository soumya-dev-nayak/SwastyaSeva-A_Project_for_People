const { WebSocketServer } = require('ws');

let wss = null;
const clients = new Map(); // clientId -> { ws, patientId, role, userId }

const initWebSocket = (server) => {
  wss = new WebSocketServer({ server });
  console.log('[WS] WebSocket server initialized');

  wss.on('connection', (ws) => {
    const clientId = Date.now() + Math.random().toString(36).slice(2);
    clients.set(clientId, { ws, patientId: null, role: null, userId: null });

    ws.send(JSON.stringify({
      type: 'CONNECTED',
      data: { message: 'Connected to SwastyaSeva HMS', timestamp: new Date().toISOString() }
    }));

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === 'SUBSCRIBE') {
          clients.set(clientId, {
            ws,
            patientId: msg.patientId || null,
            role: msg.role || 'patient',
            userId: msg.userId || null,
          });
        } else if (msg.type === 'PING') {
          ws.send(JSON.stringify({ type: 'PONG', data: { timestamp: new Date().toISOString() } }));
        }
      } catch { /* ignore malformed */ }
    });

    ws.on('close', () => clients.delete(clientId));
    ws.on('error', () => clients.delete(clientId));
  });

  // Heartbeat every 30s
  setInterval(() => {
    for (const [id, client] of clients.entries()) {
      if (client.ws.readyState !== 1) { clients.delete(id); continue; }
      try { client.ws.ping(); } catch { clients.delete(id); }
    }
  }, 30000);
};

const broadcast = (type, data) => {
  const msg = JSON.stringify({ type, data });
  for (const [, client] of clients.entries()) {
    if (client.ws.readyState === 1) {
      try { client.ws.send(msg); } catch { /* ignore */ }
    }
  }
};

const broadcastToPatient = (patientId, type, data) => {
  const msg = JSON.stringify({ type, data });
  for (const [, client] of clients.entries()) {
    if (client.patientId === patientId && client.ws.readyState === 1) {
      try { client.ws.send(msg); } catch { /* ignore */ }
    }
  }
};

const broadcastToAdmins = (type, data) => {
  const msg = JSON.stringify({ type, data });
  for (const [, client] of clients.entries()) {
    if ((client.role === 'admin' || client.role === 'hospital_admin') && client.ws.readyState === 1) {
      try { client.ws.send(msg); } catch { /* ignore */ }
    }
  }
};

const broadcastToRole = (role, type, data) => {
  const msg = JSON.stringify({ type, data });
  for (const [, client] of clients.entries()) {
    if (client.role === role && client.ws.readyState === 1) {
      try { client.ws.send(msg); } catch { /* ignore */ }
    }
  }
};

module.exports = { initWebSocket, broadcast, broadcastToPatient, broadcastToAdmins, broadcastToRole };
