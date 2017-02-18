var config = require('config');
var BaseDB = require('./basedb.js');
var ddl = require('./ddl.js').ddl;
exports.createDB = function() {
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
