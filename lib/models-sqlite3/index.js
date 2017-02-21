const config = require('config');
const BaseDB = require('./basedb.js');
exports.ddl = require('./ddl.js');
exports.createDB = function(ddl) {
    return new Promise((resolve, reject) => {
        var db = new BaseDB(config.get('dbPath'), ddl, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(db);
            }
        });
    });
};
