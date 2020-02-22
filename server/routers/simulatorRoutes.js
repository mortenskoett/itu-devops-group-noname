'use strict'

/**
 * Routing of all request regarding the simulation API.
 * Endpoint: '/api/v1/simulator/'
 */

const express = require('express');
const basicAuth = require('express-basic-auth');
const router = express.Router();
const timeUtil = require('../utilities/timeDateUtil');

// Setting HTTP Basic Authentication
// Header : Authorization
// Value : Basic base64('simulator:super_safe!');
router.use(basicAuth({
    users: { 'simulator': 'super_safe!' },      // TODO: Credentials should probably be found in config
    unauthorizedResponse: getUnauthorizedResponse
}));

// Example middleware that returns 
router.use(function youGotAccess(req, res, next) {
    console.log('Simulation API access granted: ' + req.baseUrl + ' : ' + timeUtil.getFormattedDate());
    res.send("You now have access to simulator API");
    res.end();
});

function getUnauthorizedResponse(req) {
    return req.auth
        ? ('Credentials \'' + req.auth.user + ':' + req.auth.password + '\' rejected')
        : 'No credentials provided'
}

module.exports = router;