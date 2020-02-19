'use strict'

/**
 * Routing of all request regarding flag_tool operations.
 * Endpoint: '/api/v1/flag_tool/'
 */

const express = require('express');
const router = express.Router();
const flag_toolController = require('../controllers/flag_toolController');

/* Routes */
router.get("/allmsg", function(req, res) 
{

})
router.get("/allmsg/:word", function(req, res) 
{
    res.send(req.params)
})

module.exports = router;