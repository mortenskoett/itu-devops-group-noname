const { createLogger, format, transports } = require('winston');

const {
	combine,
	timestamp,
	logstash,
} = format;

const logstashFormat = combine(
	timestamp(),
	logstash(),
);

const logger = createLogger({
	format: logstashFormat,
	transports: [
		new transports.Console(),
		new transports.File({
			filename: '/logs/minitwit.log',
		}),
	],
});

module.exports = logger;
