/**
 * Main server instance.
 */

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const back = require('express-back');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const config = require('./configs');
const viewRoutes = require('./routers/viewRoutes');
const simRouter = require('./routers/simulatorRoutes');
const Prometheus = require('./monitoring/prometheus-util');

const swaggerDocument = YAML.load('./server/swagger.yml');

/* WEB APP SERVER */
const appPort = config.app.port;
const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));

const redisClient = redis.createClient('redis://redis:6379');

redisClient.on('error', (err) => {
	console.log('Redis error: ', err);
});

app.use(session({
	secret: 'secret',
	name: '_redisPractice',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }, // Note that the cookie-parser module is no longer needed
	store: new RedisStore({ client: redisClient, ttl: 86400 }),
}));

app.use(back());

app.use('/', viewRoutes);
app.listen(appPort, () => console.log(`App listening on port ${appPort}...`));

/* SIMULATOR SERVER */
const simPort = config.simulator.port;
const simulator = express();
simulator.use(express.json());

/* SWAGGER SETUP */
const swaggerUiOptions = {
	swaggerOptions: {
		authAction: {
			Basic: {
				name: 'simulator',
				schema: {
					type: 'application/json',
					in: 'header',
					name: 'Authorization',
				},
				value: 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh',
			},
		},
	},
};

simulator.use('/api-docs', swaggerUi.serve);
simulator.get('/api-docs', swaggerUi.setup(swaggerDocument, swaggerUiOptions));

simulator.get('/swagger.json', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerDocument);
});

/* MONITORING MIDDLEWARE */
// The below arguments start the counter functions
simulator.use(Prometheus.requestCounters);
simulator.use(Prometheus.responseCounters);

// Enable collection of default metrics
Prometheus.startCollection();

// Listen and pass requests on to the simulator router
simulator.use('/', simRouter);
simulator.listen(simPort, () => console.log(`Simulator listening on port ${simPort}...`));
