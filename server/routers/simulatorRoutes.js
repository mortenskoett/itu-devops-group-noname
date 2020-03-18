
/**
 * Routing of all request regarding the simulation API.
 * Endpoint: '/api/v1/simulator/'
 */
const express = require('express');
const basicAuth = require('express-basic-auth');

const router = express.Router();

const sim = require('../controllers/simulatorController');

const prom = require('../monitoring/prometheus-util');

// Should not require authorization
router.get('/latest', sim.getLatest);
router.get('/metrics', prom.injectMetricsRoute);

function getUnauthorizedResponse(req) {
  return req.auth
    ? (`Credentials '${req.auth.user}:${req.auth.password}' rejected`)
    : 'No credentials provided';
}

/*  Setting HTTP Basic Authentication
    Header : Authorization
    Value : Basic base64('simulator:super_safe!'); */
router.use(basicAuth({
  users: { simulator: 'super_safe!' }, // TODO: Credentials should probably be found in config
  unauthorizedResponse: getUnauthorizedResponse,
}));

// Routes requiring authentication
router.post('/register', sim.register);
router.get('/msgs', sim.getMessages);
router.get('/msgs/:username', sim.getUserMessages);
router.post('/msgs/:username', sim.postMessage);
router.get('/fllws/:username', sim.getFollows);
router.post('/fllws/:username', sim.setFollow);

module.exports = router;
