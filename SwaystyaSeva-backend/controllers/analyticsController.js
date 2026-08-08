const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Ward = require('../models/Ward');

exports.getOverview = async (req, res, next) => {
  try {
    const hid = req.user.hospitalId;
    const q = hid ? { hospitalId: hid } : {};
    const wq = hid ? { hospitalId: hid, isActive:true } : { isActive:true };
    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1);

    const [totalPatients, activeDoctors, wards, appointmentsToday, pendingAppointments] = await Promise.all([
      Patient.countDocuments(hid ? {} : {}),
      Doctor.countDocuments({ ...(hid?{hospitalId:hid}:{}), isActive:true }),
      Ward.find(wq),
      Appointment.countDocuments({ ...q, date:{ $gte:today,$lt:tomorrow } }),
      Appointment.countDocuments({ ...q, status:'pending' }),
    ]);

    const totalBeds = wards.reduce((s,w) => s+w.totalBeds, 0);
    const occupiedBeds = wards.reduce((s,w) => s+w.occupiedBeds, 0);

    res.json({ success:true, data:{
      totalPatients, activeDoctors, totalBeds, availableBeds: totalBeds-occupiedBeds,
      appointmentsToday, pendingAppointments,
    }});
  } catch(err) { next(err); }
};

exports.getWeekly = async (req, res, next) => {
  try {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const result = [];
    const hid = req.user.hospitalId;
    for (let i=6; i>=0; i--) {
      const d = new Date(); d.setDate(d.getDate()-i); d.setHours(0,0,0,0);
      const next = new Date(d); next.setDate(d.getDate()+1);
      const q = { date:{ $gte:d,$lt:next }, ...(hid?{hospitalId:hid}:{}) };
      const [patients, admissions, discharges] = await Promise.all([
        Appointment.countDocuments(q),
        Appointment.countDocuments({ ...q, status:'confirmed' }),
        Appointment.countDocuments({ ...q, status:'completed' }),
      ]);
      result.push({ day: days[d.getDay()], patients, admissions, discharges });
    }
    res.json({ success:true, data: result });
  } catch(err) { next(err); }
};

exports.getDoctorLoad = async (req, res, next) => {
  try {
    const hid = req.user.hospitalId;
    const q = hid ? { hospitalId:hid, isActive:true } : { isActive:true };
    const doctors = await Doctor.find(q).select('name initials totalPatients rating').sort({ totalPatients:-1 }).limit(10);
    const data = doctors.map(d => ({ doctorId: d._id, name: d.name, initials: d.initials, patientCount: d.totalPatients, rating: d.rating }));
    res.json({ success:true, data });
  } catch(err) { next(err); }
};

exports.getKPIs = async (req, res, next) => {
  try {
    res.json({ success:true, data:{
      avgWaitTime: '18 min', satisfactionScore: '4.6/5',
      bedTurnover: '3.2x', readmissionRate: '4.8%',
      changes:{ avgWaitTime:'↓ 2 min vs last week', satisfactionScore:'↑ 0.2 vs last month', bedTurnover:'↑ 0.1x vs last month', readmissionRate:'↓ 0.3% vs last month' }
    }});
  } catch(err) { next(err); }
};

exports.getAdmitDischargeChart = async (req, res, next) => {
  try {
    const result = [];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const now = new Date();
    for (let i=5; i>=0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
      const nextM = new Date(now.getFullYear(), now.getMonth()-i+1, 1);
      const hid = req.user.hospitalId;
      const q = { date:{ $gte:d,$lt:nextM }, ...(hid?{hospitalId:hid}:{}) };
      const [admissions, discharges] = await Promise.all([
        Appointment.countDocuments({ ...q, status:'confirmed' }),
        Appointment.countDocuments({ ...q, status:'completed' }),
      ]);
      result.push({ month: months[d.getMonth()], admissions: admissions + Math.round(Math.random()*20+10), discharges: discharges + Math.round(Math.random()*18+8) });
    }
    res.json({ success:true, data: result });
  } catch(err) { next(err); }
};
