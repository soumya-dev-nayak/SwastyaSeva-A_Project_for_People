const Ward = require('../models/Ward');
const { broadcast } = require('../config/websocket');

exports.getAll = async (req, res, next) => {
  try {
    const { hospitalId } = req.query;
    const q = { isActive: true };
    if (hospitalId) q.hospitalId = hospitalId;
    else if (req.user?.hospitalId) q.hospitalId = req.user.hospitalId;
    const wards = await Ward.find(q);
    res.json({ success: true, data: wards });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const ward = await Ward.create({ ...req.body, hospitalId: req.user.hospitalId || req.body.hospitalId });
    res.status(201).json({ success: true, data: ward });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const ward = await Ward.findByIdAndUpdate(req.params.id, req.body, { new:true });
    if (!ward) return res.status(404).json({ success: false, error: 'Ward not found.' });
    broadcast('WARD_UPDATE', ward);
    res.json({ success: true, data: ward });
  } catch (err) { next(err); }
};

exports.admit = async (req, res, next) => {
  try {
    const ward = await Ward.findById(req.params.id);
    if (!ward) return res.status(404).json({ success: false, error: 'Ward not found.' });
    if (ward.occupiedBeds >= ward.totalBeds) return res.status(400).json({ success: false, error: 'Ward is full.' });
    ward.occupiedBeds += 1;
    await ward.save();
    broadcast('WARD_UPDATE', ward);
    res.json({ success: true, data: ward });
  } catch (err) { next(err); }
};

exports.discharge = async (req, res, next) => {
  try {
    const ward = await Ward.findById(req.params.id);
    if (!ward) return res.status(404).json({ success: false, error: 'Ward not found.' });
    if (ward.occupiedBeds <= 0) return res.status(400).json({ success: false, error: 'No patients to discharge.' });
    ward.occupiedBeds -= 1;
    await ward.save();
    broadcast('WARD_UPDATE', ward);
    res.json({ success: true, data: ward });
  } catch (err) { next(err); }
};
