const express = require('express');
const r = express.Router();
const c = require('../controllers/vitalsController');
const { protect } = require('../middleware/auth');

r.post('/', c.postVitals);
r.get('/:patientId', protect, c.getLatestVitals);
r.get('/:patientId/history', protect, c.getVitalsHistory);
module.exports = r;
