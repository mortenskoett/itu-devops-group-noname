/**
 * Main server instance.
 */


require('dotenv').config();
const express = require('express');
const session = require('express-session');
const back = require('express-back');
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
app.listen(appPort);

/* SIMULATOR SERVER */
const simPort = config.simulator.port;
const simulator = express();

simulator.use(express.json());

/* MONITORING */
// The below arguments start the counter functions
simulator.use(Prometheus.requestCounters);
simulator.use(Prometheus.responseCounters);
// Enable collection of default metrics
Prometheus.startCollection();

simulator.use('/', simRouter);

simulator.listen(simPort);
