const express = require('express');
const test = require('../controllers/test.js');
const signup = require('../controllers/signup.js');
const signin = require('../controllers/signin.js');
const OAuth = require('../controllers/OAuth.js');
const router = new express.Router();


router.get('/test', test)
router.post('/api/signup', signup)
router.post('/api/signin', signin)
router.post('/api/google', OAuth)

module.exports = router;