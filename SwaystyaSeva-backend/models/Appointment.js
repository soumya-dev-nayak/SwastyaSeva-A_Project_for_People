const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientId:     { type: String, required: true }, // SW-XXXX
  patientName:   { type: String },
  patientUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  doctorName:    { type: String },
  hospitalId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  hospitalName:  { type: String },
  departmentName:{ type: String },
  date:          { type: Date, required: true },
  timeSlot:      { type: String, required: true },
  visitType:     { type: String, enum: ['new_consultation','ongoing_treatment'], default: 'new_consultation' },
  status:        { type: String, enum: ['pending','confirmed','cancelled','completed'], default: 'pending' },
  notes:         { type: String },
  cancellationReason: { type: String },
  prescription:  { type: String }, // doctor fills after appointment
  diagnosis:     { type: String },
  followUpDate:  { type: Date },
  pdfGenerated:  { type: Boolean, default: false },
  consultationFee: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
