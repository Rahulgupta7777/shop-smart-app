const express = require('express');
const { requireAdmin } = require('../../middleware/requireAuth');

const productsRoutes = require('./products.routes');
const imagesRoutes = require('./images.routes');

const router = express.Router();

// Gate everything under /api/admin/* behind admin JWT
router.use(requireAdmin);

router.use('/products', productsRoutes);
router.use('/images', imagesRoutes);

module.exports = router;
