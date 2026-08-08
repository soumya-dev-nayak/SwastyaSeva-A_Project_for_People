const MedicalHistory = require('../models/MedicalHistory');

exports.getHistory = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { limit = 50 } = req.query;
    const history = await MedicalHistory.find({ patientId }).sort({ date:-1 }).limit(parseInt(limit));
    res.json({ success:true, data: history, total: history.length });
  } catch(err) { next(err); }
};

exports.createEntry = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const entry = await MedicalHistory.create({ patientId, ...req.body });
    res.status(201).json({ success:true, data: entry });
  } catch(err) { next(err); }
};

exports.updateEntry = async (req, res, next) => {
  try {
    const entry = await MedicalHistory.findByIdAndUpdate(req.params.id, req.body, { new:true });
    if (!entry) return res.status(404).json({ success:false, error:'Not found.' });
    res.json({ success:true, data: entry });
  } catch(err) { next(err); }
};

exports.deleteEntry = async (req, res, next) => {
  try {
    await MedicalHistory.findByIdAndDelete(req.params.id);
    res.json({ success:true, message:'Deleted.' });
  } catch(err) { next(err); }
};
