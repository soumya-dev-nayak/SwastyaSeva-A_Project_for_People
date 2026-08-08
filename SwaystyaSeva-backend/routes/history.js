const express = require('express');
const r = express.Router();
const c = require('../controllers/historyController');
const { protect } = require('../middleware/auth');
const { requireHospitalAdmin, requireDoctor } = require('../middleware/role');

r.get('/:patientId', protect, c.getHistory);
r.post('/:patientId', protect, requireDoctor, c.createEntry);
r.patch('/entry/:id', protect, requireDoctor, c.updateEntry);
r.delete('/entry/:id', protect, requireHospitalAdmin, c.deleteEntry);
module.exports = r;
