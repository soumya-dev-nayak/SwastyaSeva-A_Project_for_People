const express = require('express');
const r = express.Router();
const c = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');
const { requireHospitalAdmin, requireDoctor } = require('../middleware/role');

r.get('/', protect, c.getAll);
r.get('/:id', protect, c.getById);
r.post('/', protect, c.create);
r.patch('/:id/approve', protect, requireHospitalAdmin, c.approve);
r.patch('/:id/reject', protect, requireHospitalAdmin, c.reject);
r.patch('/:id/complete', protect, requireDoctor, c.complete);
module.exports = r;
