const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  userId:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  patientId:        { type: String, unique: true, required: true }, // SW-XXXX
  name:             { type: String, required: true },
  email:            { type: String },
  phone:            { type: String },
  dateOfBirth:      { type: Date },
  gender:           { type: String, enum: ['Male','Female','Other'] },
  bloodGroup:       { type: String, enum: ['A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown'], default: 'Unknown' },
  allergies:        [String],
  chronicConditions:[String],
  address:          { type: String },
  state:            { type: String },
  emergencyContact: { name: String, phone: String, relation: String },
  assignedDoctor:   { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  preferredHospital:{ type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  admissionStatus:  { type: String, enum: ['outpatient','admitted','discharged'], default: 'outpatient' },
  height:           { type: Number }, // cm
  weight:           { type: Number }, // kg
  isActive:         { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);
