'use strict'

/**
 * Routing of all request regarding users.
 * Endpoint: '/api/v1/user/'
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/* Routes */
router.post('/login/auth', userController.checkUserCredentials);

module.exports = router;