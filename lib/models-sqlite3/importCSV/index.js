/**
 * Created by Rafzalan@gmail.com on 7/14/2016.
 */
const fs = require('fs');
const parse = require('csv-parse');
const transform = require('stream-transform');
const insert = require('../sql/insert.js');
const CSVParser = function (callback, transformFunction) {
    var parser = parse({delimiter: ',', columns: true});
    var transformer = transform((record) => {
        setTimeout(() => {
            if(transformFunction) {
              callback(null, transformFunction(record), parser.count);
            } else {
              callback(null, record, parser.count);
            }
        }, 500);
    }, {parallel: 10});
    this.read = function(path) {
        var input = fs.createReadStream(path);
        input.pipe(parser).pipe(transformer);
    };
};
exports.importFromCSV = function(/*basedb*/ db, path, transformFunction) {
    return new Promise(function (resolve, reject) {
        var counter = 0;
        db.exec("BEGIN");
        var csvParser = new (CSVParser)(function (err, data, count) {
            if (!err) {
                insert[data._verb](db, data)
                    .then(function () {
                        counter += 1;
                        if (count === counter) {
                            db.exec("COMMIT");
                            resolve(count);
                        }
                    })
                    .catch(function (err) {
                        db.exec("ROLLBACK");
                        reject('adduser failed with ' + err);
                    });
            } else {
                reject('Create new CSVParser failed with ' + err);
            }
        }, transformFunction);
        csvParser.read(path);
    });
};
/*
exports.importReportFromCSV
exports.importAttachmentFromCSV
exports.importPIType_1FromCSV
exports.importPIType_2FromCSV
exports.importPIType_3FromCSV
exports.importPIClassFromCSV
exports.importPIFromCSV
exports.importPIValueFromCSV
exports.importPITargetFromCSV
exports.importMessageFromCSV
*/
