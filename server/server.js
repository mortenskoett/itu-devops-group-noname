/**
 * Main server instance.
 */

'use strict'

require('dotenv').config();
const config = require('./configs');
const express = require('express');
const session = require('express-session');
const back = require('express-back');

const viewRoutes = require('./routers/viewRoutes');
const simRouter = require('./routers/simulatorRoutes');


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
    saveUninitialized: true
}));
app.use(back());

app.use('/', viewRoutes);
app.listen(appPort, () => console.log(`Minitwit web app server listening on port ${appPort}.`));

/* SIMULATOR SERVER */
const simPort = config.simulator.port;
const simulator = express();

simulator.use(express.json());
simulator.use('/', simRouter)

/**
 * This creates the module that we created in the step before.
 * In my case it is stored in the util folder.
 */
var Prometheus = require('./monitoring/prometheus-util');

/**
 * The below arguments start the counter functions
 */
app.use(Prometheus.requestCounters);  
app.use(Prometheus.responseCounters);

/**
 * Enable metrics endpoint
 */
//Prometheus.injectMetricsRoute(app);

/**
 * Enable collection of default metrics
 */
Prometheus.startCollection(); 

/* MONITORING */
// simulator.get('/metrics', (req, res) => {
// 	res.set('Content-Type', register.contentType);
// 	res.end(register.metrics());
// });

simulator.listen(simPort, () => console.log(`Simulator API server listening on port ${simPort}.`));