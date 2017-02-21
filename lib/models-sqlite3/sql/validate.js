const insertvalidverbs = {
  addUser: 'tblUser',
  addReportClass: 'tblReportClass',
  createReport: 'tblReport',
  addAttachment: 'tblAttachment',
  addPIType_1: 'tblPIType_1',
  addPIType_2: 'tblPIType_2',
  addPIType_3: 'tblPIType_3',
  addPIClass: 'tblPIClass',
  createPI: 'tblPI',
  setPIValue: 'tblPIValue',
  setPITarget: 'tblPITarget',
  sendMeggesge: 'tblMessage'
};
const updatevalidverbs = {

};
const deletevalidverbs = {

};
exports.validateForInsert = function (verb, data) {
    return new Promise((resolve, reject) => {
          if (!insertvalidverbs.hasOwnProperty(verb)) {
              reject('validateForInsert failed, ' + verb + ' not exists');
          } else {
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
