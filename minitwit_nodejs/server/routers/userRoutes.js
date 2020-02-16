'use strict'

/**
 * Routing of all request regarding users.
 * Endpoint: '/api/v1/user/'
 */

const express = require('express');
const router = express.Router();
const timeUtil = require('../utilities/timeDateUtil');
const userController = require('../controllers/userController');

// Middleware example time logging specific to this router
router.use(function timeLog(req, res, next) {
    console.log(req.baseUrl + ' : ', timeUtil.getFormattedDate());
    next();
})

/* Routes */
router.post('/login/auth', userController.checkUserCredentials);

module.exports = router;