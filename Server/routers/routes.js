const express = require('express');
const test = require('../controllers/test.js');
const signup = require('../controllers/signup.js');
const router = new express.Router();

router.get('/test', test)
router.post('/api/signup', signup)


module.exports = router;