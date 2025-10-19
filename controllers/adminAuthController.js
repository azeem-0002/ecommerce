const models = require('../models');
const AuthService = require('../services/AuthService');
const authService = new AuthService(models);

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
