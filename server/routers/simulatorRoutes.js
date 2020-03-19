
/**
 * Routing of all request regarding the simulation API.
 * Endpoint: '/api/v1/simulator/'
 */
const express = require('express');
const basicAuth = require('express-basic-auth');
const sim = require('../controllers/simulatorController');
const prom = require('../monitoring/prometheus-util');

const router = express.Router();

/* Routes not requiring authorization */
/**
 * @swagger
 * /latest:
 *   get:
 *     description: Get latest accepted id
 *     responses:
 *       '200':
 *         description: Returns latest accepted id by the server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Latest'
 */
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

/* Routes requiring authentication */
router.post('/register', sim.register);
router.get('/msgs', sim.getMessages);
router.get('/msgs/:username', sim.getUserMessages);
router.post('/msgs/:username', sim.postMessage);
router.get('/fllws/:username', sim.getFollows);
router.post('/fllws/:username', sim.setFollow);

module.exports = router;

// Swagger definitions
/**
 * @swagger
 * definitions:
 *     Latest:
 *       properties:
 *         latest:
 *           type: integer
 *           example: 256123
 */
