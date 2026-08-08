const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

exports.getAll = async (req, res, next) => {
  try {
    const { hospitalId, departmentName, available, search } = req.query;
    const q = { isActive: true };
    if (hospitalId) q.hospitalId = hospitalId;
    if (departmentName) q.departmentName = new RegExp(departmentName, 'i');
    if (available !== undefined) q.available = available === 'true';
    if (search) q.$or = [{ name: new RegExp(search,'i') }, { specialization: new RegExp(search,'i') }];
    const docs = await Doctor.find(q).populate('hospitalId','name city phone').sort({ rating:-1 });
    res.json({ success: true, data: docs, total: docs.length });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const doc = await Doctor.findById(req.params.id).populate('hospitalId','name city phone address');
    if (!doc) return res.status(404).json({ success: false, error: 'Doctor not found.' });
    res.json({ success: true, data: doc });
  } catch (err) { next(err); }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const doc = await Doctor.findOne({ userId: req.user._id }).populate('hospitalId','name city phone address departments');
    if (!doc) return res.status(404).json({ success: false, error: 'Doctor profile not found.' });
    // Today's appointments
    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1);
    const todayAppts = await Appointment.find({ doctorId: doc._id, date: { $gte:today, $lt:tomorrow }, status: { $in:['confirmed','pending'] } }).sort({ timeSlot:1 });
    const upcoming = await Appointment.find({ doctorId: doc._id, date: { $gte: new Date() }, status:'confirmed' }).sort({ date:1 }).limit(20);
    res.json({ success: true, data: { doctor: doc, todayAppointments: todayAppts, upcomingAppointments: upcoming } });
  } catch (err) { next(err); }
};

exports.getDoctorStats = async (req, res, next) => {
  try {
    const doc = await Doctor.findOne({ userId: req.user._id });
    if (!doc) return res.status(404).json({ success: false, error: 'Not found.' });
    const total = await Appointment.countDocuments({ doctorId: doc._id });
    const completed = await Appointment.countDocuments({ doctorId: doc._id, status:'completed' });
    const pending = await Appointment.countDocuments({ doctorId: doc._id, status:'pending' });
    const confirmed = await Appointment.countDocuments({ doctorId: doc._id, status:'confirmed' });
    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1);
    const todayCount = await Appointment.countDocuments({ doctorId: doc._id, date:{ $gte:today, $lt:tomorrow } });
    res.json({ success: true, data: { totalCases:total, completed, pending, confirmed, todayCount, totalPatients: doc.totalPatients, rating: doc.rating } });
  } catch (err) { next(err); }
};

exports.setAvailability = async (req, res, next) => {
  try {
    const { available } = req.body;
    const doc = await Doctor.findByIdAndUpdate(req.params.id, { available }, { new:true });
    if (!doc) return res.status(404).json({ success: false, error: 'Not found.' });
    res.json({ success: true, data: doc });
  } catch (err) { next(err); }
};

exports.applyLeave = async (req, res, next) => {
  try {
    const { from, to, reason } = req.body;
    const doc = await Doctor.findOne({ userId: req.user._id });
    if (!doc) return res.status(404).json({ success: false, error: 'Not found.' });
    doc.leaves.push({ from: new Date(from), to: new Date(to), reason, status:'pending' });
    await doc.save();
    res.json({ success: true, data: doc.leaves[doc.leaves.length-1] });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const doc = await Doctor.create(req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const doc = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new:true });
    if (!doc) return res.status(404).json({ success: false, error: 'Not found.' });
    res.json({ success: true, data: doc });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Doctor.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Doctor removed.' });
  } catch (err) { next(err); }
};

exports.getPatients = async (req, res, next) => {
  try {
    const doc = await Doctor.findOne({ userId: req.user._id });
    if (!doc) return res.status(404).json({ success: false, error: 'Not found.' });
    const appts = await Appointment.find({ doctorId: doc._id, status:'completed' }).sort({ date:-1 });
    const patientIds = [...new Set(appts.map(a => a.patientId))];
    const Patient = require('../models/Patient');
    const patients = await Patient.find({ patientId: { $in: patientIds } });
    res.json({ success: true, data: patients, total: patients.length });
  } catch (err) { next(err); }
};
