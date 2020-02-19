/**
 * Main server instance.
 */

'use strict'

require('dotenv').config();
const config = require('./configs');
const express = require('express');
const session = require('express-session');

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

app.use('/', viewRoutes);
app.listen(appPort, () => console.log(`Minitwit server listening on port ${appPort}.`));


/* SIMULATOR SERVER */
const simPort = config.simulator.port;
const simulator = express();

simulator.use(express.json());
simulator.use('/', simRouter)

simulator.listen(simPort, () => console.log(`Simulator server listening on port ${simPort}.`));