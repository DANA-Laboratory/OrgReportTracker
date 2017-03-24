const config = require('config');
const BaseDB = require('./basedb.js');
var db = null;
exports.ddl = require('./ddl.js');
exports.createDB = function(ddl) {
  return new Promise((resolve, reject) => {
        new BaseDB(config.get('dbPath'), ddl, function (db_, err) {
            if (err) {
                reject(err);
            } else {
                db = db_;
                resolve(db_);
            }
        });
    });
};
exports.getdb = function() {
    return db;
};
exports.opendb = function() {
    return new Promise((resolve, reject) => {
        if (db !== null) {
            resolve(db);
        } else {
            new BaseDB(config.get('dbPath'), null, function (db_, err) {
                if (err) {
                    reject(err);
                } else {
                    db = db_;
                    resolve(db_);
                }
            });
        }
    });
};
exports.closedb = function() {
    return new Promise((resolve, reject) => {
        if (db !== null) {
            db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    db = null;
                    resolve();
                }
            });
        } else {
            resolve();
        }
    });
};
