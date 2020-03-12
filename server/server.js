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
    saveUninitialized: true
}));
app.use(back());


app.use('/', viewRoutes);
app.listen(appPort, () => console.log(`Minitwit web app server listening on port ${appPort}.`));

/* SIMULATOR SERVER */
const simPort = config.simulator.port;
const simulator = express();

simulator.use(express.json());

/* MONITORING */
//The below arguments start the counter functions
simulator.use(Prometheus.requestCounters);  
simulator.use(Prometheus.responseSummary);
//Enable collection of default metrics
Prometheus.startCollection(); 

simulator.use('/', simRouter)

simulator.listen(simPort, () => console.log(`Simulator API server listening on port ${simPort}.`));