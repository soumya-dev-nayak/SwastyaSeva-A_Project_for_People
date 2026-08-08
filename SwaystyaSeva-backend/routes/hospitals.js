const express = require('express');
const r = express.Router();
const c = require('../controllers/hospitalController');
const { protect } = require('../middleware/auth');
const { optionalAuth } = require('../middleware/auth');

r.get('/', optionalAuth, c.getAll);
r.get('/states', c.getStates);
r.get('/slug/:slug', c.getBySlug);
r.get('/:id', c.getById);
r.get('/:hospitalId/departments/:deptName/doctors', c.getDepartmentDoctors);
module.exports = r;
