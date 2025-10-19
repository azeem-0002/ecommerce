const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const multer = require('multer');
const path = require('path');

// upload config
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, path.join(__dirname, '../public/uploads')); },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowed = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext) && allowed.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only images allowed'));
  }
});

router.get('/categories', publicController.listCategories);
router.get('/categories/:id/products', publicController.listProductsByCategory);

router.get('/products', publicController.listProducts);
router.get('/products/:id', publicController.getProduct);

router.post('/uploads', upload.single('file'), publicController.uploadFile);

router.post('/orders', publicController.createOrder);
router.get('/orders/:orderNumber/status', publicController.orderStatusLookup);

module.exports = router;
