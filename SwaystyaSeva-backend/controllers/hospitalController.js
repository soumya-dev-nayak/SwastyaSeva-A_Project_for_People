const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');

exports.getAll = async (req, res, next) => {
  try {
    const { state, city, type, search } = req.query;
    const q = { isActive: true };
    if (state) q.state = new RegExp(state, 'i');
    if (city)  q.city  = new RegExp(city, 'i');
    if (type)  q.type  = type;
    if (search) q.$or = [ { name: new RegExp(search, 'i') }, { city: new RegExp(search, 'i') } ];
    const hospitals = await Hospital.find(q).sort({ rating: -1 });
    res.json({ success: true, data: hospitals, total: hospitals.length });
  } catch (err) { next(err); }
};

exports.getStates = async (req, res, next) => {
  try {
    const states = await Hospital.distinct('state');
    const result = [];
    for (const state of states.sort()) {
      const count = await Hospital.countDocuments({ state, isActive: true });
      result.push({ state, count });
    }
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ slug: req.params.slug, isActive: true });
    if (!hospital) return res.status(404).json({ success: false, error: 'Hospital not found.' });
    // Attach doctor counts per department
    const doctors = await Doctor.find({ hospitalId: hospital._id, isActive: true });
    const deptMap = {};
    for (const d of doctors) {
      deptMap[d.departmentName] = (deptMap[d.departmentName] || 0) + 1;
    }
    const hosObj = hospital.toObject();
    hosObj.departments = hosObj.departments.map(dep => ({ ...dep, doctorCount: deptMap[dep.name] || dep.doctorCount }));
    res.json({ success: true, data: hosObj });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ success: false, error: 'Hospital not found.' });
    res.json({ success: true, data: hospital });
  } catch (err) { next(err); }
};

exports.getDepartmentDoctors = async (req, res, next) => {
  try {
    const { hospitalId, deptName } = req.params;
    const doctors = await Doctor.find({ hospitalId, departmentName: new RegExp(deptName, 'i'), isActive: true }).sort({ rating: -1 });
    res.json({ success: true, data: doctors, total: doctors.length });
  } catch (err) { next(err); }
};
