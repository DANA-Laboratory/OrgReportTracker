const winston = require('winston');
const app = require('../app');
const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            filename: 'logs/winston.log'
        })
    ]
});
require('winston-logs-display')(app, logger);
module.exports = logger;