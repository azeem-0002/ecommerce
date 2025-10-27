const models = require('../models');
const OrderService = require('../services/OrderService');
const service = new OrderService(models);

exports.list = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const data = await service.list({ page: parseInt(page)||1, limit: parseInt(limit)||20, status });
    res.json(data);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const o = await service.getById(req.params.id);
    res.json(o);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    // allow updating status, paymentReference
    const updates = {};
    if (req.body.status) updates.status = req.body.status;
    if (req.body.orderNumber) updates.orderNumber = req.body.orderNumber;
    if (updates.status === 'confirmed') {
      const o = await service.confirmOrder(req.params.id, updates);
      res.json(o);
    } else {
      const o = await models.Order.findByPk(req.params.id);
      if (!o) throw { status: 404, message: 'Order not found' };
      await o.update(updates);
      res.json(o);
    }
  } catch (err) { next(err); }
};
