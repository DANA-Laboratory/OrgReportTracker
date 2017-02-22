const insertvalidverbs = {
  addUser: ['tblUser', 8],
  addReportClass: ['tblReportClass', 4],
  createReport: ['tblReport', 10],
  addAttachment: ['tblAttachment', 6],
  addPIType_1: ['tblPIType_1', 2],
  addPIType_2: ['tblPIType_2', 3],
  addPIType_3: ['tblPIType_3', 3],
  addPIClass: ['tblPIClass', 10],
  createPI: ['tblPI', 8],
  setPIValue: ['tblPIValue', 6],
  setPITarget: ['tblPITarget', 7],
  sendMeggesge: ['tblMessage', 7]
};
const updatevalidverbs = {

};
const deletevalidverbs = {

};
exports.validateInsert = function (verb, data) {
    return new Promise((resolve, reject) => {
          if (!insertvalidverbs.hasOwnProperty(verb)) {
              reject('validateForInsert failed, ' + verb + ' not exists');
          } else {
              data.tbl = insertvalidverbs[verb][0];
              data.clmc = insertvalidverbs[verb][1];
              if (process.env.NODE_ENV !== 'development') {
                  if (verb === 'addUser') {
                    data.sysadmin = false;
                  }
              }
              resolve(data);
          }
    });
};
exports.validateForDelete = function (verb, data) {
    return new Promise((resolve, reject) => {
          if (!deletevalidverbs.hasOwnProperty(verb)) {
              reject('validateForInsert failed, ' + verb + ' not exists');
          } else {
              resolve(data);
          }
    });
};
exports.validateForUpdate= function (verb, data) {
    return new Promise((resolve, reject) => {
          if (!updatevalidverbs.hasOwnProperty(verb)) {
              reject('validateForInsert failed, ' + verb + ' not exists');
          } else {
              resolve(data);
          }
    });
};
