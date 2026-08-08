// patientController.js
const Patient = require('../models/Patient');
const User = require('../models/User');

exports.getAll = async (req, res, next) => {
  try {
    const q = {};
    if (req.user.role === 'hospital_admin') {
      const Hospital = require('../models/Hospital');
      const Appointment = require('../models/Appointment');
      const appts = await Appointment.distinct('patientId', { hospitalId: req.user.hospitalId });
      q.patientId = { $in: appts };
    }
    const { search } = req.query;
    if (search) q.$or = [{ name: new RegExp(search,'i') }, { patientId: new RegExp(search,'i') }];
    const patients = await Patient.find(q).sort({ createdAt:-1 }).limit(200);
    res.json({ success: true, data: patients, total: patients.length });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const p = await Patient.findOne({ patientId: req.params.patientId }).populate('assignedDoctor','name specialization');
    if (!p) return res.status(404).json({ success: false, error: 'Patient not found.' });
    res.json({ success: true, data: p });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const p = await Patient.findOneAndUpdate({ patientId: req.params.patientId }, req.body, { new:true });
    if (!p) return res.status(404).json({ success: false, error: 'Not found.' });
    res.json({ success: true, data: p });
  } catch (err) { next(err); }
};

module.exports = exports;
