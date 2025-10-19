const models = require('../models');
const ImageService = require('../services/ImageService');
const service = new ImageService(models);

exports.create = async (req, res, next) => {
  try {
    const data = await service.create(req.params.productId, req.body);
    res.status(201).json(data);
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    await service.delete(req.params.productId, req.params.imageId);
    res.json({ success: true });
  } catch (err) { next(err); }
};
