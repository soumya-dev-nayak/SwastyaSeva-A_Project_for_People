const Report = require('../models/Report');
const path = require('path');
const fs = require('fs');

exports.getReports = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const reports = await Report.find({ patientId }).sort({ date:-1 });
    res.json({ success:true, data: reports });
  } catch(err) { next(err); }
};

exports.uploadReport = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    if (!req.file) return res.status(400).json({ success:false, error:'No file uploaded.' });
    const report = await Report.create({
      patientId, name: req.body.name || req.file.originalname, type: req.body.type || 'Lab Report',
      filePath: req.file.path, fileName: req.file.originalname, fileSize: req.file.size, mimeType: req.file.mimetype,
      uploadedBy: req.user.role === 'doctor' ? 'doctor' : 'patient',
      doctorName: req.body.doctorName,
    });
    res.status(201).json({ success:true, data: report });
  } catch(err) { next(err); }
};

exports.downloadFile = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.reportId);
    if (!report || !report.filePath) return res.status(404).json({ success:false, error:'File not found.' });
    if (!fs.existsSync(report.filePath)) return res.status(404).json({ success:false, error:'File missing from disk.' });
    const download = req.query.download === 'true';
    if (download) res.setHeader('Content-Disposition', `attachment; filename="${report.fileName}"`);
    res.setHeader('Content-Type', report.mimeType || 'application/octet-stream');
    res.sendFile(path.resolve(report.filePath));
  } catch(err) { next(err); }
};

exports.deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.reportId);
    if (!report) return res.status(404).json({ success:false, error:'Not found.' });
    if (report.filePath && fs.existsSync(report.filePath)) fs.unlinkSync(report.filePath);
    res.json({ success:true, message:'Report deleted.' });
  } catch(err) { next(err); }
};
