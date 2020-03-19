/**
 * Main server instance.
 */


require('dotenv').config();
const express = require('express');
const session = require('express-session');
const back = require('express-back');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./configs');

const viewRoutes = require('./routers/viewRoutes');
const simRouter = require('./routers/simulatorRoutes');
const Prometheus = require('./monitoring/prometheus-util');

/* WEB APP SERVER */
const appPort = config.app.port;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));
app.set('view engine', 'ejs');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
}));
app.use(back());
app.use('/', viewRoutes);
app.listen(appPort, () => console.log(`App listening on port ${appPort}...`));

/* SIMULATOR SERVER */
const simPort = config.simulator.port;
const simulator = express();
simulator.use(express.json());

/* SWAGGER SETUP */
const swaggerOptions = {
	swaggerDefinition: {
		info: {
			title: 'Minitwit Simulator API',
			description: 'Description of the dev-ops course simulator API',
			contact: 'group j',
		},
		servers: ['http://localhost:5001'],
	},
	apis: ['./server/routers/simulatorRoutes.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
simulator.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
simulator.get('/swagger.json', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerDocs);
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
