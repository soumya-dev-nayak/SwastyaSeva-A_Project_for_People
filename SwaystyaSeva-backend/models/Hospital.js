const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  floor:        { type: String },
  wing:         { type: String },
  rooms:        { type: String },
  avgWaitMins:  { type: Number, default: 15 },
  icon:         { type: String, default: '🏥' },
  doctorCount:  { type: Number, default: 0 },
});

const HospitalSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  slug:          { type: String, unique: true, lowercase: true },
  state:         { type: String, required: true },
  city:          { type: String, required: true },
  address:       { type: String, required: true },
  phone:         { type: String, required: true },
  emergency:     { type: String },
  email:         { type: String },
  website:       { type: String },
  type:          { type: String, enum: ['Government', 'Private', 'Teaching Hospital', 'Multi-Specialty', 'Charitable'], default: 'Private' },
  rating:        { type: Number, default: 4.0, min: 0, max: 5 },
  totalBeds:     { type: Number, default: 100 },
  availableBeds: { type: Number, default: 50 },
  departments:   [DepartmentSchema],
  departmentCount: { type: Number, default: 0 },
  specialties:   [String],
  established:   { type: Number },
  lat:           { type: Number },
  lng:           { type: Number },
  mapUrl:        { type: String },
  images:        [String],
  accreditation: [String], // NABH, NABL, JCI etc
  facilities:    [String], // ICU, Blood Bank, OT etc
  adminUsers:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

HospitalSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  this.departmentCount = this.departments.length;
  next();
});

module.exports = mongoose.model('Hospital', HospitalSchema);
