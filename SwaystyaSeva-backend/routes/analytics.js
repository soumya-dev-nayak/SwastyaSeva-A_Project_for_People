const express = require('express');
const r = express.Router();
const c = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { requireHospitalAdmin } = require('../middleware/role');

r.get('/overview', protect, requireHospitalAdmin, c.getOverview);
r.get('/weekly', protect, requireHospitalAdmin, c.getWeekly);
r.get('/doctor-load', protect, requireHospitalAdmin, c.getDoctorLoad);
r.get('/kpis', protect, requireHospitalAdmin, c.getKPIs);
r.get('/admit-discharge', protect, requireHospitalAdmin, c.getAdmitDischargeChart);
module.exports = r;
