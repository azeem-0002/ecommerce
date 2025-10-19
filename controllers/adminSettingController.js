const models = require('../models');
const SettingService = require('../services/SettingService');
const service = new SettingService(models);

exports.get = async (req, res, next) => {
  try {
    const data = await service.getAll();
    res.json(data);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const result = await service.bulkUpsert(req.body);
    res.json(result);
  } catch (err) { next(err); }
};
