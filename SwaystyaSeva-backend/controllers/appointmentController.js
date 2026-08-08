const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const MedicalHistory = require('../models/MedicalHistory');
const { broadcast, broadcastToPatient } = require('../config/websocket');

exports.getAll = async (req, res, next) => {
  try {
    const { status, date, limit = 100 } = req.query;
    const q = {};
    if (req.user.role === 'patient') q.patientId = req.user.patientId;
    if (req.user.role === 'doctor') {
      const Doctor = require('../models/Doctor');
      const doc = await Doctor.findOne({ userId: req.user._id });
      if (doc) q.doctorId = doc._id;
    }
    if (req.user.role === 'hospital_admin') q.hospitalId = req.user.hospitalId;
    if (status) q.status = status;
    if (date) { const d = new Date(date); const next = new Date(d); next.setDate(d.getDate()+1); q.date = { $gte:d, $lt:next }; }
    const appts = await Appointment.find(q).sort({ date: -1 }).limit(parseInt(limit));
    res.json({ success: true, data: appts, total: appts.length });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { doctorId, date, timeSlot, visitType, hospitalId, hospitalName, notes } = req.body;
    if (!doctorId || !date || !timeSlot) return res.status(400).json({ success: false, error: 'doctorId, date and timeSlot required.' });
    const doc = await Doctor.findById(doctorId);
    if (!doc) return res.status(404).json({ success: false, error: 'Doctor not found.' });
    const appt = await Appointment.create({
      patientId: req.user.patientId, patientName: req.user.name,
      patientUserId: req.user._id, doctorId, doctorName: doc.name,
      hospitalId: hospitalId || doc.hospitalId, hospitalName: hospitalName || '',
      departmentName: doc.departmentName, date: new Date(date),
      timeSlot, visitType: visitType || 'new_consultation',
      status: 'pending', notes, consultationFee: doc.consultationFee,
    });
    broadcast('NEW_APPOINTMENT', { appointment: appt });
    res.status(201).json({ success: true, data: appt });
  } catch (err) { next(err); }
};

exports.approve = async (req, res, next) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, { status:'confirmed' }, { new:true });
    if (!appt) return res.status(404).json({ success: false, error: 'Appointment not found.' });
    broadcastToPatient(appt.patientId, 'APPT_STATUS', { appointmentId: appt._id, status:'confirmed', doctorName: appt.doctorName, date: appt.date, timeSlot: appt.timeSlot });
    res.json({ success: true, data: appt });
  } catch (err) { next(err); }
};

exports.reject = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const appt = await Appointment.findByIdAndUpdate(req.params.id, { status:'cancelled', cancellationReason: reason }, { new:true });
    if (!appt) return res.status(404).json({ success: false, error: 'Appointment not found.' });
    broadcastToPatient(appt.patientId, 'APPT_STATUS', { appointmentId: appt._id, status:'cancelled', doctorName: appt.doctorName });
    res.json({ success: true, data: appt });
  } catch (err) { next(err); }
};

exports.complete = async (req, res, next) => {
  try {
    const { prescription, diagnosis, followUpDate, notes } = req.body;
    const appt = await Appointment.findByIdAndUpdate(req.params.id, { status:'completed', prescription, diagnosis, followUpDate, notes }, { new:true });
    if (!appt) return res.status(404).json({ success: false, error: 'Appointment not found.' });
    // Create history entry
    if (diagnosis) {
      await MedicalHistory.create({
        patientId: appt.patientId, date: appt.date, diagnosis,
        doctorId: appt.doctorId, doctorName: appt.doctorName,
        hospitalId: appt.hospitalId, hospitalName: appt.hospitalName,
        prescription, notes, appointmentId: appt._id,
      });
    }
    broadcastToPatient(appt.patientId, 'APPT_STATUS', { appointmentId: appt._id, status:'completed', doctorName: appt.doctorName, prescription });
    res.json({ success: true, data: appt });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ success: false, error: 'Not found.' });
    res.json({ success: true, data: appt });
  } catch (err) { next(err); }
};
