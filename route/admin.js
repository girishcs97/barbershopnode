const express = require('express');
const router = express.Router();
const { signin } = require('../controllers/admin');

router.post('/signin',signin)

module.exports = router;