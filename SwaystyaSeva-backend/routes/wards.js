const express = require('express');
const r = express.Router();
const c = require('../controllers/wardController');
const { protect } = require('../middleware/auth');
const { requireHospitalAdmin } = require('../middleware/role');

r.get('/', protect, c.getAll);
r.post('/', protect, requireHospitalAdmin, c.create);
r.patch('/:id', protect, requireHospitalAdmin, c.update);
r.patch('/:id/admit', protect, requireHospitalAdmin, c.admit);
r.patch('/:id/discharge', protect, requireHospitalAdmin, c.discharge);
module.exports = r;
