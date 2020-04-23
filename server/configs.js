
const env = process.env.NODE_ENV; // 'dev' or 'production'

const dev = {
	simulator: {
		user: 'simulator',
		pass: 'super_safe!',
		port: process.env.SIM_PORT || 5001,
	},
	app: {
		name: process.env.APP_NAME,
		port: process.env.APP_PORT || 5000,
		environment: process.env.APPLICATION_ENV,
		logpath: process.env.LOG_PATH,
	},
	database: {
		path: './server/persistence/sqlite/minitwit.db',
		protocol: 'sqlite',
	},
	swagger: {
		name: 'swagger',
		port: 9000,
	},
	application_logging: {
		file: process.env.LOG_PATH,
		level: process.env.LOG_LEVEL || 'info',
		console: process.env.LOG_ENABLE_CONSOLE || true,
	},
};

const production = {
	simulator: {
		user: 'simulator',
		pass: 'super_safe!',
		port: process.env.SIM_PORT || 5001,
	},
	app: {
		name: process.env.APP_NAME,
		port: process.env.APP_PORT || 5000,
		environment: process.env.APPLICATION_ENV,
		logpath: process.env.LOG_PATH,
	},
	swagger: {
		name: 'swagger',
		port: 9000,
	},
	database: {
		url: 'postgres://embu:magic@64.225.111.21:5432/minitwit-db',
		protocol: 'postgres',
	},
	application_logging: {
		file: process.env.LOG_PATH,
		level: process.env.LOG_LEVEL || 'info',
		console: process.env.LOG_ENABLE_CONSOLE || true,
	},
};

const config = {
	dev,
	production,
};

module.exports = config[env];
