/**
 * Newly added requires
 */
const Prom = require('prom-client');
const Register = require('prom-client').register;
const { Counter } = require('prom-client');
// var Histogram = require('prom-client').Histogram;
const { Summary } = require('prom-client');
const ResponseTime = require('response-time');
// var Logger = require('./logger');

/**
 * A Prometheus counter that counts the invocations of the different HTTP verbs
 * e.g. a GET and a POST call will be counted as 2 different calls
 */
const numOfRequests = new Counter({
	name: 'minitwit_numOfRequests',
	help: 'Number of requests made',
	labelNames: ['method'],
});

/**
 * A Prometheus counter that counts the invocations with different paths
 * e.g. /foo and /bar will be counted as 2 different paths
 */
// module.exports.pathsTaken = pathsTaken = new Counter({
//     name: 'minitwit_pathsTaken',
//     help: 'Paths taken in the app',
//     labelNames: ['path']
// });

/**
 * A Prometheus summary to record the HTTP method, path, response code and response time
 */
const responses = new Summary({
	name: 'minitwit_responses',
	help: 'Response time in millis',
	labelNames: ['status'],
});

/**
 * This funtion will start the collection of metrics
 * and should be called from within in the main js file
 */
module.exports.startCollection = function () {
	// Logger.log(Logger.LOG_INFO, `Starting the collection of metrics,
	// the metrics are available on /metrics`);
	Prom.collectDefaultMetrics();
};

/**
 * This function increments the counters that are executed on the request side of an invocation
 * Currently it increments the counters for numOfPaths and pathsTaken
 */
module.exports.requestCounters = function (req, res, next) {
	if (req.path !== '/metrics') {
		numOfRequests.inc({ method: req.method });
		// pathsTaken.inc({ path: req.path });
	}
	next();
};

/**
 * This function increments the counters that are executed on the response side of an invocation
 * Currently it updates the responses summary
 */
module.exports.responseCounters = ResponseTime((req, res) => {
	if (req.url !== '/metrics') {
		responses.labels(res.statusCode);
	}
});

/**
 * In order to have Prometheus get the data from this app a specific URL is registered
 */
module.exports.injectMetricsRoute = async function (req, res) {
//    App.get('/metrics', (req, res) => {
	res.set('Content-Type', Register.contentType);
	res.end(Register.metrics());
//    });
};

module.exports.numOfRequests = numOfRequests;
module.exports.responses = responses;
