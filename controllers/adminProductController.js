const models = require('../models');
const ProductService = require('../services/ProductService');
const service = new ProductService(models);

exports.list = async (req, res, next) => {
  try {
    const { page, limit, categoryId, q } = req.query;
    const data = await service.list({ page: parseInt(page)||1, limit: parseInt(limit)||10, categoryId, q });
    res.json(data);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const p = await service.create(req.body);
    res.status(201).json(p);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const p = await service.findById(req.params.id);
    res.json(p);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await service.update(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await service.delete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};
