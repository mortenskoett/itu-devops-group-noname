'use strict'

/**
 * Routing of all request regarding messages.
 * Endpoint: '/api/v1/message/'
 */

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

/* Routes */
router.post('/post', messageController.postMessage);

module.exports = router;