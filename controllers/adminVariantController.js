const models = require('../models');
const VariantService = require('../services/VariantService');
const service = new VariantService(models);

exports.create = async (req, res, next) => {
  try {
    // You can add validation for nested variants here if you use Joi or express-validator
    const p = await service.create(req.body);
    res.status(201).json(p);
  } catch (err) {
    next(err);
  }
};


exports.update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.productId, req.params.variantId, req.body);
    res.json(data);
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    await service.delete(req.params.productId, req.params.variantId);
    res.json({ success: true });
  } catch (err) { next(err); }
};
