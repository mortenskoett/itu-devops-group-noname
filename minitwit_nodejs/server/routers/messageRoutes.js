'use strict'

/**
 * Routing of all request regarding messages.
 * Endpoint: '/api/v1/message/'
 */

const express = require('express');
const router = express.Router();
const messageControler = require('../controllers/messageController');

// Middleware example time logging specific to this router
router.use(function timeLog (req, res, next) {
  console.log(req.baseUrl+ ' : ', Date.now())
  res.send("You reached messageRouter");
  next()
})

/* Routes */
router.post('/postmessage', messageControler.postMessage);

module.exports = router;