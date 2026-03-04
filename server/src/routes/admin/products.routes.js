const express = require('express');
const products = require('../../controllers/admin/products.controller');

const router = express.Router();

router.post('/', products.create);
router.put('/:id', products.update);
router.delete('/:id', products.remove);

module.exports = router;
