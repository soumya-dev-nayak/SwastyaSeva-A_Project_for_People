const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Hospital = require('../models/Hospital');

// Counter for patient IDs
const getNextPatientId = async () => {
  const last = await User.findOne({ role: 'patient', patientId: { $regex: /^SW-/ } }).sort({ patientId: -1 });
  if (!last || !last.patientId) return 'SW-4821';
  const num = parseInt(last.patientId.replace('SW-', ''), 10);
  return `SW-${num + 1}`;
};

const getNextDoctorId = async () => {
  const last = await User.findOne({ role: 'doctor', doctorId: { $regex: /^DR-/ } }).sort({ doctorId: -1 });
  if (!last || !last.doctorId) return 'DR-5001';
  const num = parseInt(last.doctorId.replace('DR-', ''), 10);
  return `DR-${num + 1}`;
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'patient', phone, state, hospitalId, departmentName, specialization, experience, consultationFee } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, error: 'Name, email and password are required.' });
    if (password.length < 6) return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ success: false, error: 'Email already registered.' });

    let patientId = null;
    let doctorId = null;

    if (role === 'patient') patientId = await getNextPatientId();
    if (role === 'doctor') doctorId = await getNextDoctorId();

    const user = await User.create({ name, email, password, role, phone, state, patientId, doctorId, hospitalId: hospitalId || null });

    // Create profile
    if (role === 'patient') {
      await Patient.create({ userId: user._id, patientId, name, email, phone, state, address: state ? `${state}, India` : '' });
    }
    if (role === 'doctor' && hospitalId) {
      const hosp = await Hospital.findById(hospitalId);
      await Doctor.create({
        userId: user._id, doctorId, name, email, phone, state,
        specialization: specialization || 'General Medicine',
        experience: experience || 1, consultationFee: consultationFee || 500,
        hospitalId, departmentName: departmentName || 'General Medicine',
        available: true, availableSlots: ['9:00 AM', '11:00 AM', '2:00 PM'],
      });
      if (hosp) await Hospital.findByIdAndUpdate(hospitalId, { $inc: { departmentCount: 0 } });
    }

    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    const userData = { id: user._id, name: user.name, email: user.email, role: user.role, patientId: user.patientId, doctorId: user.doctorId, hospitalId: user.hospitalId, state: user.state };
    res.status(201).json({ success: true, message: 'Account created.', data: { token, refreshToken, user: userData } });
  } catch (err) { next(err); }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: 'Email and password required.' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !user.isActive) return res.status(401).json({ success: false, error: 'Invalid credentials.' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ success: false, error: 'Invalid credentials.' });

    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    // Fetch extra profile data
    let extraData = {};
    if (user.role === 'patient') {
      const p = await Patient.findOne({ userId: user._id });
      if (p) extraData = { bloodGroup: p.bloodGroup, phone: p.phone };
    }
    if (user.role === 'doctor') {
      const d = await Doctor.findOne({ userId: user._id }).populate('hospitalId', 'name city');
      if (d) extraData = { specialization: d.specialization, hospitalName: d.hospitalId?.name, consultationFee: d.consultationFee };
    }
    if (user.role === 'hospital_admin') {
      const h = await Hospital.findById(user.hospitalId).select('name city state');
      if (h) extraData = { hospitalName: h.name, hospitalCity: h.city };
    }

    const userData = {
      id: user._id, name: user.name, email: user.email, role: user.role,
      patientId: user.patientId, doctorId: user.doctorId,
      hospitalId: user.hospitalId, state: user.state, ...extraData,
    };
    res.json({ success: true, message: 'Login successful.', data: { token, refreshToken, user: userData } });
  } catch (err) { next(err); }
};

// GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let profile = null;
    if (user.role === 'patient') profile = await Patient.findOne({ userId: user._id });
    if (user.role === 'doctor') profile = await Doctor.findOne({ userId: user._id }).populate('hospitalId','name city phone');
    res.json({ success: true, data: { user, profile } });
  } catch (err) { next(err); }
};
