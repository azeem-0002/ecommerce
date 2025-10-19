const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'changeme';
const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

function sign(payload) {
  return jwt.sign(payload, secret, { expiresIn });
}

function verify(token) {
  return jwt.verify(token, secret);
}

module.exports = { sign, verify };
