'use strict'

/**
 * Routing of all request regarding messages.
 * Endpoint: '/api/v1/message/'
 */

const express = require('express');
const router = express.Router();
const timeUtil = require('../utilities/timeDateUtil');
const messageControler = require('../controllers/messageController');

// Middleware example time logging specific to this router
router.use(function timeLog(req, res, next) {
    console.log(req.baseUrl + ' : ', timeUtil.getFormattedDate());
    // res.send("You reached messageRouter");
    next()
})

/* Routes */
router.post('/post', messageControler.postMessage);

module.exports = router;