const winston = require('winston');
const app = require('../app');
const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            filename: 'logs/winston.log'
        })
    ]
});
var defaultOptions = {
    from: new Date() - 30 * 24 * 60 * 60 * 1000,
    until: new Date(),
    limit: 50,
    start: 0,
    order: 'desc'
};
function extend(obj, src) {
    Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
    return obj;
}
//
// Find items logged for a month limit to 100 items.
//
logger.queryUserLog = function(customOptions) {
    return new Promise((resolve, reject) => {
        var options = extend(defaultOptions, customOptions);
        logger.query(options, function (err, results) {
            if (err) {
                reject(err);
            } else {
                if (options.account == null) {
                    resolve(results);
                } else {
                    var filteredlog = results.file.filter((log) => {
                        return (log.message.search(` account=${options.account}`) > 0);
                    });
                    resolve(filteredlog);
                }
            }
        });
    });
};
require('winston-logs-display')(app, logger);
module.exports = logger;
