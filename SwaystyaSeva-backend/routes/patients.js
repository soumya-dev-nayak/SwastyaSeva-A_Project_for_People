const express = require('express');
const r = express.Router();
const c = require('../controllers/patientController');
const { protect } = require('../middleware/auth');

r.get('/', protect, c.getAll);
r.get('/:patientId', protect, c.getById);
r.patch('/:patientId', protect, c.update);
module.exports = r;
