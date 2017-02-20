var tables = ['tblUser', 'tblReportClass', 'tblReport', 'tblAttachment', 'tblPIType_1', 'tblPIType_2', 'tblPIType_3', 'tblPIClass', 'tblPI', 'tblPIValue', 'tblPITarget', 'tblMessage'];
exports.validateForInsert = function (tablename, data) {
    return new Promise((resolve, reject) => {
          if (tables.indexOf(tablename) === -1) {
              reject('validateForInsert failed, ' + tablename + ' not exists');
          }
          else
              resolve(data);
    });
};
exports.validateForDelete = function (tablename, data) {
    return new Promise((resolve, reject) => {
          if (tables.indexOf(tablename) === -1) {
              reject('validateForInsert failed, ' + tablename + ' not exists');
          }
          else
              resolve(data);
    });
};
exports.validateForUpdate= function (tablename, data) {
    return new Promise((resolve, reject) => {
          if (tables.indexOf(tablename) === -1) {
              reject('validateForInsert failed, ' + tablename + ' not exists');
          }
          else
              resolve(data);
    });
};
