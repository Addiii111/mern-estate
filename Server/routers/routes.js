const express = require('express');
const test = require('../controllers/test.js');
const router = new express.Router();

router.get('/test', test)


module.exports = router;