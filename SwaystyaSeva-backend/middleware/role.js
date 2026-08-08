const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, error: 'Not authenticated.' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, error: `Access denied. Required role: ${roles.join(' or ')}.` });
  }
  next();
};

const requireAdmin = requireRole('admin');
const requireHospitalAdmin = requireRole('admin', 'hospital_admin');
const requireDoctor = requireRole('admin', 'hospital_admin', 'doctor');
const requirePatient = requireRole('patient');

const requireOwnerOrAdmin = (paramName = 'patientId') => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, error: 'Not authenticated.' });
  const isAdmin = ['admin', 'hospital_admin', 'doctor'].includes(req.user.role);
  const isOwner = req.user.patientId === req.params[paramName];
  if (!isAdmin && !isOwner) return res.status(403).json({ success: false, error: 'Access denied.' });
  next();
};

module.exports = { requireRole, requireAdmin, requireHospitalAdmin, requireDoctor, requirePatient, requireOwnerOrAdmin };
