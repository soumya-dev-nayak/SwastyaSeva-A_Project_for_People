const Vitals = require('../models/Vitals');
const { validateVitals, generateAlerts, formatVitalsForBroadcast } = require('../services/vitalsService');
const { broadcast, broadcastToPatient } = require('../config/websocket');
const { markSensorActive } = require('../services/wsService');

exports.postVitals = async (req, res, next) => {
  try {
    const { patientId, hr, spo2, temp, sysBP, diaBP, fatigue, source, deviceId, finger } = req.body;
    if (!patientId) return res.status(400).json({ success: false, error: 'patientId required.' });

    if (finger === false) {
      broadcast('VITALS_UPDATE', { patientId, hr:0, spo2:0, temp:0, sysBP:null, diaBP:null, fatigue:null, finger:false, source:'sensor', timestamp:new Date() });
      return res.status(200).json({ success: true, message: 'No finger.' });
    }

    const { valid, errors } = validateVitals(hr, spo2, temp);
    if (!valid) return res.status(400).json({ success: false, error: errors.join(' ') });

    const alerts = generateAlerts(hr, sysBP, diaBP, spo2, temp, fatigue);
    const doc = await Vitals.create({ patientId, hr: hr ? Math.round(hr) : undefined, sysBP: sysBP ? Math.round(sysBP) : undefined, diaBP: diaBP ? Math.round(diaBP) : undefined, spo2: spo2 ? +parseFloat(spo2).toFixed(1) : undefined, temp: temp ? +parseFloat(temp).toFixed(1) : undefined, fatigue: fatigue ? Math.round(fatigue) : undefined, source: source || 'sensor', deviceId: deviceId || '', finger: true, alerts });

    markSensorActive(patientId, { hr, sysBP, diaBP, spo2, temp, fatigue, finger: true });
    const payload = { ...formatVitalsForBroadcast(doc), finger: true };
    broadcast('VITALS_UPDATE', payload);

    if (alerts.length > 0) broadcastToPatient(patientId, 'VITAL_ALERT', { patientId, alerts, vitals: { hr, spo2, temp } });

    res.status(201).json({ success: true, data: payload, alerts });
  } catch (err) { next(err); }
};

exports.getLatestVitals = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const vitals = await Vitals.getLatest(patientId);
    if (!vitals) return res.status(404).json({ success: false, error: 'No vitals found.' });
    res.json({ success: true, data: formatVitalsForBroadcast(vitals) });
  } catch (err) { next(err); }
};

exports.getVitalsHistory = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { limit = 200, from, to } = req.query;
    const history = await Vitals.getHistory(patientId, parseInt(limit), from, to);
    res.json({ success: true, data: history.map(formatVitalsForBroadcast), total: history.length });
  } catch (err) { next(err); }
};
