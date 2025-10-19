const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const adminCategoryController = require('../controllers/adminCategoryController');
const adminProductController = require('../controllers/adminProductController');
const adminVariantController = require('../controllers/adminVariantController');
const adminImageController = require('../controllers/adminImageController');
const adminOrderController = require('../controllers/adminOrderController');
const adminSettingController = require('../controllers/adminSettingController');

router.use(authenticateAdmin);

// Categories
router.get('/categories', adminCategoryController.list);
router.post('/categories', adminCategoryController.create);
router.get('/categories/:id', adminCategoryController.get);
router.put('/categories/:id', adminCategoryController.update);
router.delete('/categories/:id', adminCategoryController.remove);

// Products
router.get('/products', adminProductController.list);
router.post('/products', adminProductController.create);
router.get('/products/:id', adminProductController.get);
router.put('/products/:id', adminProductController.update);
router.delete('/products/:id', adminProductController.delete);

// Variants
router.post('/products/:productId/variants', adminVariantController.create);
router.put('/products/:productId/variants/:variantId', adminVariantController.update);
router.delete('/products/:productId/variants/:variantId', adminVariantController.delete);

// Images
router.post('/products/:productId/images', adminImageController.create);
router.delete('/products/:productId/images/:imageId', adminImageController.delete);

// Orders
router.get('/orders', adminOrderController.list);
router.get('/orders/:id', adminOrderController.get);
router.put('/orders/:id', adminOrderController.update);

// Settings
router.get('/settings', adminSettingController.get);
router.put('/settings', adminSettingController.update);

module.exports = router;
