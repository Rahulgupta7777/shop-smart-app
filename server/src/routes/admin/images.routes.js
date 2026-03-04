const express = require('express');
const images = require('../../controllers/admin/images.controller');

const router = express.Router();

router.post('/generate', images.generate);
router.post('/upload', images.upload);

module.exports = router;
