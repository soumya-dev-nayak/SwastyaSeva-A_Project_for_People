const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:      { type: String, required: true, minlength: 6, select: false },
  role:          { type: String, enum: ['admin', 'hospital_admin', 'doctor', 'patient'], default: 'patient' },
  phone:         { type: String, trim: true },
  patientId:     { type: String, unique: true, sparse: true }, // SW-XXXX for patients
  doctorId:      { type: String, unique: true, sparse: true }, // DR-XXXX for doctors
  hospitalId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }, // for hospital_admin & doctor
  state:         { type: String }, // state where they work/live
  isActive:      { type: Boolean, default: true },
  isVerified:    { type: Boolean, default: true },
  profileImage:  { type: String },
  lastLogin:     { type: Date },
}, { timestamps: true });

// Hash password before save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Generate access token
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role, patientId: this.patientId, doctorId: this.doctorId, name: this.name, hospitalId: this.hospitalId, state: this.state },
    process.env.JWT_SECRET || 'swastyaseva_jwt_secret_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Generate refresh token
UserSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET || 'swastyaseva_refresh_secret_2026',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
};

module.exports = mongoose.model('User', UserSchema);
