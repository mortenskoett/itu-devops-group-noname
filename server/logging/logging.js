const { createLogger, format, transports } = require('winston');

const {
	combine,
	timestamp,
} = format;

const logstashFormat = combine(
	timestamp(),
	format.simple(),
);

const logger = createLogger({
	format: logstashFormat,
	transports: [
		new transports.Console({
		}),
		new transports.File({
			filename: '/logs/minitwit.log',
		}),
	],
});

module.exports = logger;
