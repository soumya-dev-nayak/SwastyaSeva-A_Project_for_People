const mongoose = require('mongoose');

const VitalsSchema = new mongoose.Schema({
  patientId:   { type: String, required: true, index: true },
  hr:          { type: Number }, // heart rate BPM
  sysBP:       { type: Number }, // systolic BP mmHg
  diaBP:       { type: Number }, // diastolic BP mmHg
  spo2:        { type: Number }, // SpO2 %
  temp:        { type: Number }, // temperature °C
  fatigue:     { type: Number }, // fatigue index 0-100
  source:      { type: String, enum: ['sensor','simulation','manual'], default: 'simulation' },
  deviceId:    { type: String },
  finger:      { type: Boolean, default: true },
  alerts:      [{ type: String, message: String, severity: String }],
  timestamp:   { type: Date, default: Date.now, index: true },
}, { timestamps: false });

VitalsSchema.index({ patientId: 1, timestamp: -1 });

VitalsSchema.statics.getLatest = function(patientId) {
  return this.findOne({ patientId }).sort({ timestamp: -1 });
};

VitalsSchema.statics.getHistory = function(patientId, limit = 100, from, to) {
  const q = { patientId };
  if (from || to) {
    q.timestamp = {};
    if (from) q.timestamp.$gte = new Date(from);
    if (to)   q.timestamp.$lte = new Date(to);
  }
  return this.find(q).sort({ timestamp: -1 }).limit(limit);
};

module.exports = mongoose.model('Vitals', VitalsSchema);
