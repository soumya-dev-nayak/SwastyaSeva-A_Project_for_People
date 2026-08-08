const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  patientId:    { type: String, required: true },
  patientUserId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:         { type: String, required: true },
  type:         { type: String, default: 'Lab Report' },
  doctorId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  doctorName:   { type: String },
  hospitalId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  filePath:     { type: String },
  fileName:     { type: String },
  fileSize:     { type: Number },
  mimeType:     { type: String },
  date:         { type: Date, default: Date.now },
  status:       { type: String, enum: ['pending','ready'], default: 'ready' },
  uploadedBy:   { type: String, enum: ['patient','doctor','admin'], default: 'patient' },
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
