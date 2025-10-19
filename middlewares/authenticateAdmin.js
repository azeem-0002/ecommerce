const jwtUtil = require('../utils/jwt');
const { Admin } = require('../models');
module.exports = async function authenticateAdmin(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: 'Missing auth' });
    const parts = auth.split(' ');
    if (parts.length !==2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid auth format' });
    const token = parts[1];
    const payload = jwtUtil.verify(token);
    if (!payload || payload.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const admin = await Admin.findByPk(payload.id);
    if (!admin) return res.status(403).json({ message: 'Forbidden' });
    req.admin = { id: admin.id, email: admin.email, name: admin.name };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token', detail: err.message });
  }
};
