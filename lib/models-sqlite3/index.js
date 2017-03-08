const config = require('config');
const BaseDB = require('./basedb.js');
exports.ddl = require('./ddl.js');
exports.createDB = function(ddl) {
    return new Promise((resolve, reject) => {
        new BaseDB(config.get('dbPath'), ddl, function (db_, err) {
            if (err) {
                reject(err);
            } else {
                resolve(db_);
            }
        });
    });
};
