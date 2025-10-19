const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const { validate } = require('../middlewares/validateRequest');
const Joi = require('joi');

const loginSchema = Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() });

router.post('/login', validate(loginSchema), adminAuthController.login);

module.exports = router;
