const mongoose = require('mongoose');

const AvailabilitySlotSchema = new mongoose.Schema({
  day:       { type: String, enum: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], required: true },
  startTime: { type: String, required: true }, // '9AM'
  endTime:   { type: String, required: true }, // '1PM'
});

const LeaveSchema = new mongoose.Schema({
  from:   { type: Date, required: true },
  to:     { type: Date, required: true },
  reason: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

const DoctorSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  doctorId:        { type: String, unique: true }, // DR-XXXX
  name:            { type: String, required: true },
  initials:        { type: String, maxlength: 4 },
  email:           { type: String },
  phone:           { type: String },
  specialization:  { type: String, required: true },
  subSpecialization: { type: String },
  qualification:   [String], // MBBS, MD, etc.
  experience:      { type: Number, default: 1 }, // years
  consultationFee: { type: Number, default: 500 }, // INR
  hospitalId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  departmentName:  { type: String, required: true },
  state:           { type: String },
  rating:          { type: Number, default: 4.5, min: 0, max: 5 },
  totalPatients:   { type: Number, default: 0 },
  available:       { type: Boolean, default: true },
  availableSlots:  [String], // legacy: ['9:00 AM', '11:00 AM']
  availability:    [AvailabilitySlotSchema], // new detailed
  leaves:          [LeaveSchema],
  profileImage:    { type: String },
  bio:             { type: String },
  isActive:        { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);
