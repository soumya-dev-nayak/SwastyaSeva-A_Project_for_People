const express = require('express');
const r = express.Router();
const c = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');
const { requireHospitalAdmin, requireDoctor } = require('../middleware/role');

r.get('/', protect, c.getAll);
r.get('/me', protect, requireDoctor, c.getMyProfile);
r.get('/me/stats', protect, requireDoctor, c.getDoctorStats);
r.get('/me/patients', protect, requireDoctor, c.getPatients);
r.post('/me/leave', protect, requireDoctor, c.applyLeave);
r.get('/:id', protect, c.getById);
r.post('/', protect, requireHospitalAdmin, c.create);
r.patch('/:id', protect, requireHospitalAdmin, c.update);
r.delete('/:id', protect, requireHospitalAdmin, c.remove);
r.patch('/:id/availability', protect, requireHospitalAdmin, c.setAvailability);
module.exports = r;
