'use strict';

module.exports = {
    simulator: {
        user: 'simulator',
        pass: 'super_safe!',
        port: 5001
    },
    app: {
        name: process.env.APP_NAME,
        port: process.env.APP_PORT || 5000,
        environment: process.env.APPLICATION_ENV,
        logpath: process.env.LOG_PATH,
    },
    sqlite: {
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        name: process.env.DB_NAME
    },
    application_logging: {
        file: process.env.LOG_PATH,
        level: process.env.LOG_LEVEL || 'info',
        console: process.env.LOG_ENABLE_CONSOLE || true
    }
};
