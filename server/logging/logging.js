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

// const myFormat = printf(({
// 	level, message, messageLabel, messageTimestamp,
// }) => `${messageTimestamp} [${messageLabel}] ${level}: ${message}`);

const logger = createLogger({
	format: logstashFormat,
	transports: [new transports.Console()],
});

// if (process.env.NODE_ENV !== 'production') {
// 	logger.add(new winston.transports.Console({
// 		format: winston.format.simple(),
// 	}));
// }

module.exports = logger;
