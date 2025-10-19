const BaseService = require('./BaseService');
const bcrypt = require('bcrypt');
const jwtUtil = require('../utils/jwt');

class AuthService extends BaseService {
  constructor(models) {
    super(models);
    this.Admin = models.Admin;
  }

  async login(email, password) {
    const admin = await this.Admin.findOne({ where: { email } });
    if (!admin) throw { status: 401, message: 'Invalid credentials' };
    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) throw { status: 401, message: 'Invalid credentials' };
    const token = jwtUtil.sign({ id: admin.id, email: admin.email, role: 'admin' });
    return { token, admin: { id: admin.id, email: admin.email, name: admin.name } };
  }
}

module.exports = AuthService;
