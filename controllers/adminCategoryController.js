const models = require('../models');
const CategoryService = require('../services/CategoryService');
const service = new CategoryService(models);

exports.list = async (req, res, next) => {
  try {
    const items = await service.list();
    res.json(items);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const cat = await service.create(req.body);
    res.status(201).json(cat);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const cat = await service.findById(req.params.id);
    res.json(cat);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const cat = await service.update(req.params.id, req.body);
    res.json(cat);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await service.delete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};
