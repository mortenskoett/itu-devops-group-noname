'use strict'

/**
 * Base routing of requests.
 */

const express = require('express');
const router = express.Router();

const viewRoutes = require('./viewRoutes');
const simulatorRoutes = require('./simulatorRoutes');
const messageRoutes = require('./messageRoutes');

const API_ROUTE = '/api/v1';

// Example middleware that time logs specific to this router
router.use(API_ROUTE, function timeLog (req, res, next) {
  console.log(req.baseUrl + ' : ', Date.now());
  next();
})

/* Routes */
router.get('/', viewRoutes);
router.use(API_ROUTE + '/simulator', simulatorRoutes);
router.use(API_ROUTE + '/message', messageRoutes); 

module.exports = router;