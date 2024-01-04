const express = require('express');
const test = require('../controllers/test.js');
const signup = require('../controllers/signup.js');
const signin = require('../controllers/signin.js');
const router = new express.Router();

router.get('/test', test)
router.post('/api/signup', signup)
router.post('/api/signin', signin)


module.exports = router;