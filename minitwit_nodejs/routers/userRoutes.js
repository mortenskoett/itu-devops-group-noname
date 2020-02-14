'use strict'

/**
 * User routing of all request regarding users.
 * Endpoint: '/api/users'
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Middleware example time logging specific to this router
router.use(function timeLog (req, res, next) {
  console.log(req.url + ' : ', Date.now())
  next()
})

//
router.get('/:username', userController.getUser);

module.exports = router;