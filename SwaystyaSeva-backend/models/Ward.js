const mongoose = require('mongoose');

const WardSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  type:         { type: String, enum: ['icu','general','emergency','pediatrics','maternity','surgery','oncology'], default: 'general' },
  hospitalId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  totalBeds:    { type: Number, required: true },
  occupiedBeds: { type: Number, default: 0 },
  cleanliness:  { type: String, enum: ['Good','Moderate','Critical'], default: 'Good' },
  color:        { type: String, default: '#2563eb' },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

WardSchema.virtual('availableBeds').get(function() {
  return this.totalBeds - this.occupiedBeds;
});
WardSchema.virtual('occupancyPct').get(function() {
  return this.totalBeds > 0 ? Math.round(this.occupiedBeds / this.totalBeds * 100) : 0;
});

module.exports = mongoose.model('Ward', WardSchema);
