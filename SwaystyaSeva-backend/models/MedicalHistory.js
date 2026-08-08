const mongoose = require('mongoose');

const MedicalHistorySchema = new mongoose.Schema({
  patientId:    { type: String, required: true, index: true },
  patientUserId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date:         { type: Date, required: true, default: Date.now },
  diagnosis:    { type: String, required: true },
  doctorId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  doctorName:   { type: String },
  hospitalId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  hospitalName: { type: String },
  prescription: { type: String },
  notes:        { type: String },
  followUpDate: { type: Date },
  severity:     { type: String, enum: ['mild','moderate','severe'], default: 'mild' },
  appointmentId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
}, { timestamps: true });

module.exports = mongoose.model('MedicalHistory', MedicalHistorySchema);
