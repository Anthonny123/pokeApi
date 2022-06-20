const express = require('express');
const router = express.Router();
const httpAuth = require('./auth-http');

//Routes
router.route('/')
    .get(httpAuth.homeAuth);

router.route('/login')
    .post(httpAuth.loginAuth);

exports.router = router;