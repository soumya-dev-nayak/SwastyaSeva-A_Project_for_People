const express = require('express');
const r = express.Router();
const c = require('../controllers/reportController');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.resolve('./uploads/reports');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g,'-')),
});
const upload = multer({ storage, limits:{ fileSize: 10*1024*1024 }, fileFilter:(req,file,cb)=>{ const ok=['application/pdf','image/png','image/jpeg']; ok.includes(file.mimetype)?cb(null,true):cb(new Error('Only PDF/PNG/JPEG allowed')); } });

r.get('/:patientId', protect, c.getReports);
r.post('/upload/:patientId', protect, upload.single('file'), c.uploadReport);
r.get('/file/:reportId', protect, c.downloadFile);
r.delete('/:reportId', protect, c.deleteReport);
module.exports = r;
