const { createLogger, format, transports } = require('winston');
require('winston-logstash');

const {
	combine,
	timestamp,
	logstash,
} = format;

const logstashFormat = combine(
	timestamp(),
	logstash(),
);

// const myFormat = printf(({
// 	level, message, messageLabel, messageTimestamp,
// }) => `${messageTimestamp} [${messageLabel}] ${level}: ${message}`);
const logger = createLogger({
	format: logstashFormat,
	transports: [
		new transports.Console(),
		// new transports.Logstash({
		// 	port: 5100,
		// 	host: 'localhost',
		// })
		new transports.File({
			filename: '/logs/minitwit.log',
		}),
	],
});

// if (process.env.NODE_ENV !== 'production') {
// 	logger.add(new winston.transports.Console({
// 		format: winston.format.simple(),
// 	}));
// }

module.exports = logger;
