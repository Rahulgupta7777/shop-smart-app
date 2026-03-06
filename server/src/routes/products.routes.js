const express = require('express');
const products = require('../controllers/products.controller');

const router = express.Router();

// Public catalog endpoints
router.get('/', products.list);
router.get('/:id', products.get);

module.exports = router;
