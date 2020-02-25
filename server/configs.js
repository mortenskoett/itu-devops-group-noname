'use strict';

const env = process.env.NODE_ENV; // 'dev' or 'production'

const dev = {
    simulator: {
        user: 'simulator',
        pass: 'super_safe!',
        port: process.env.SIM_PORT || 5001
    },
    app: {
        name: process.env.APP_NAME,
        port: process.env.APP_PORT || 5000,
        environment: process.env.APPLICATION_ENV,
        logpath: process.env.LOG_PATH,
    },
    database: {
        path: './data/sqlite/minitwit.db',
        protocol: "sqlite",
    },
    application_logging: {
        file: process.env.LOG_PATH,
        level: process.env.LOG_LEVEL || 'info',
        console: process.env.LOG_ENABLE_CONSOLE || true
    }
};

const production = {
    simulator: {
        user: 'simulator',
        pass: 'super_safe!',
        port: process.env.SIM_PORT || 5001
    },
    app: {
        name: process.env.APP_NAME,
        port: process.env.APP_PORT || 5000,
        environment: process.env.APPLICATION_ENV,
        logpath: process.env.LOG_PATH,
    },
    database: {
        url: 'postgres://embu:123@localhost:5432/embu',
        protocol: "postgres",
    },
    application_logging: {
        file: process.env.LOG_PATH,
        level: process.env.LOG_LEVEL || 'info',
        console: process.env.LOG_ENABLE_CONSOLE || true
    }
};

const config = {
 dev,
 production
};

module.exports = config[env];
