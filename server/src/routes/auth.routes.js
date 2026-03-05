const express = require('express');
const auth = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.get('/me', requireAuth, auth.me);

module.exports = router;
