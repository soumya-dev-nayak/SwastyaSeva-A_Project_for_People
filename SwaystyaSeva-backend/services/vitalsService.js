const generateAlerts = (hr, sysBP, diaBP, spo2, temp, fatigue) => {
  const alerts = [];
  if (hr !== undefined && hr !== null) {
    if (hr < 50 || hr > 110) alerts.push({ type:'hr', message:`Heart rate ${hr < 50 ? 'critically low' : 'critically high'}: ${hr} BPM`, severity:'critical' });
    else if (hr < 60 || hr > 100) alerts.push({ type:'hr', message:`Heart rate ${hr < 60 ? 'low' : 'high'}: ${hr} BPM`, severity:'warning' });
  }
  if (spo2 !== undefined && spo2 !== null) {
    if (spo2 < 90) alerts.push({ type:'spo2', message:`Critical hypoxemia: SpO₂ ${spo2}%`, severity:'critical' });
    else if (spo2 < 95) alerts.push({ type:'spo2', message:`Low oxygen saturation: SpO₂ ${spo2}%`, severity:'warning' });
  }
  if (temp !== undefined && temp !== null) {
    if (temp > 38.5) alerts.push({ type:'temp', message:`High fever: ${temp}°C`, severity:'critical' });
    else if (temp > 37.5) alerts.push({ type:'temp', message:`Fever: ${temp}°C`, severity:'warning' });
    else if (temp < 36) alerts.push({ type:'temp', message:`Low temperature: ${temp}°C`, severity:'warning' });
  }
  if (sysBP !== undefined && sysBP !== null) {
    if (sysBP >= 140 || diaBP >= 90) alerts.push({ type:'bp', message:`High blood pressure: ${sysBP}/${diaBP} mmHg`, severity:'warning' });
  }
  return alerts;
};

const validateVitals = (hr, spo2, temp) => {
  const errors = [];
  if (hr !== undefined && hr !== null && (hr < 20 || hr > 250)) errors.push('Heart rate out of range (20-250 BPM).');
  if (spo2 !== undefined && spo2 !== null && (spo2 < 60 || spo2 > 100)) errors.push('SpO₂ out of range (60-100%).');
  if (temp !== undefined && temp !== null && (temp < 30 || temp > 45)) errors.push('Temperature out of range (30-45°C).');
  return { valid: errors.length === 0, errors };
};

const formatVitalsForBroadcast = (doc) => ({
  _id: doc._id,
  patientId: doc.patientId,
  hr: doc.hr, sysBP: doc.sysBP, diaBP: doc.diaBP,
  spo2: doc.spo2, temp: doc.temp, fatigue: doc.fatigue,
  source: doc.source, finger: doc.finger,
  alerts: doc.alerts || [],
  timestamp: doc.timestamp,
});

module.exports = { generateAlerts, validateVitals, formatVitalsForBroadcast };
