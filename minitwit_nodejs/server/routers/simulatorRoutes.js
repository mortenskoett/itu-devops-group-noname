'use strict'

/**
 * Routing of all request regarding the simulation API.
 * Endpoint: '/api/v1/simulator/'
 */

const express = require('express');
const router = express.Router();


// Example middleware time logging specific to this router
router.use(function timeLog (req, res, next) {
  console.log(req.baseUrl + ' : ', Date.now())
  res.send("You reached simulatorRouter");
})

module.exports = router;