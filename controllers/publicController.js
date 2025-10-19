const models = require('../models');
const ProductService = require('../services/ProductService');
const CategoryService = require('../services/CategoryService');
const OrderService = require('../services/OrderService');

const productService = new ProductService(models);
const categoryService = new CategoryService(models);
const orderService = new OrderService(models);

// GET /api/categories
exports.listCategories = async (req, res, next) => {
  try {
    const items = await categoryService.list();
    res.json(items);
  } catch (err) { next(err); }
};

// GET /api/categories/:id/products
exports.listProductsByCategory = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const data = await productService.list({ page: parseInt(page)||1, limit: parseInt(limit)||10, categoryId: req.params.id });
    res.json(data);
  } catch (err) { next(err); }
};

// GET /api/products
exports.listProducts = async (req, res, next) => {
  try {
    const { page, limit, categoryId, q } = req.query;
    const data = await productService.list({ page: parseInt(page)||1, limit: parseInt(limit)||10, categoryId, q });
    res.json(data);
  } catch (err) { next(err); }
};

// GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const p = await productService.findById(req.params.id);
    res.json(p);
  } catch (err) { next(err); }
};

// POST /api/uploads
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  } catch (err) { next(err); }
};

// POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const result = await orderService.createOrder(req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
};

// GET /api/orders/:orderNumber/status?phone=...
exports.orderStatusLookup = async (req, res, next) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ message: 'phone query param required' });
    const result = await orderService.publicStatusLookup(req.params.orderNumber, phone);
    res.json(result);
  } catch (err) { next(err); }
};
