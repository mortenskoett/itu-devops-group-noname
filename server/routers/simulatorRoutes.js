
/**
 * Routing of all request regarding the simulation API.
 * Endpoint: '/api/v1/simulator/'
 */
const express = require('express');
const basicAuth = require('express-basic-auth');
const sim = require('../controllers/simulatorController');
const prom = require('../monitoring/prometheus-util');

const router = express.Router();

router.get('/latest', sim.getLatest);
router.get('/metrics', prom.injectMetricsRoute);

// Error return 401 message
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

/* Routes not requiring authorization */
/**
 * @swagger
 * /latest:
 *   get:
 *     summary: Get latest accepted id
 *     responses:
 *       '200':
 *         description: Returns latest accepted id by the server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/LatestResponse'
 */
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Post new user to register
 *     parameters:
 *       - in: query
 *         name: latest
 *         description: latest id sent by simulator api
 *         required: false
 *         schema:
 *           type: integer
 *     requestBody:
 *       $ref: '#/components/RegisterUserBody'
 *     responses:
 *       '204':
 *         description: User registered
 *       '400':
 *         description: Error on insert with description
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/RegisterErrorResponse'
 */
// Swagger definitions
/**
 * @swagger
 * definitions:
 *   LatestResponse:
 *     properties:
 *       latest:
 *         type: integer
 *         example: 256123
 */
