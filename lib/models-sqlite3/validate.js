const config = require('config');
const insertvalidverbs = {
  addUser: ['tblUser', 8, '(account, password, fname, lname, pcode, workunit, sysadmin, attribute)'],
  addReportClass: ['tblReportClass', 4, '(caption, dayduration, user_owner, attribute)'],
  createReport: ['tblReport', 10, '(reportclass_id, caption, time_limit, user_owner, user_creator, ip_user, time_create, pathfile, time_latestissue, attribute)'],
  addAttachment: ['tblAttachment', 6, '(report_id, pathfile, user_attach, ip_user, time_attach, attribute)'],
  addPIType_1: ['tblPIType_1', 2, '(caption, attribute)'],
  addPIType_2: ['tblPIType_2', 3, '(caption, pitype_1_id , attribute)'],
  addPIType_3: ['tblPIType_3', 3, '(caption, pitype_2_id , attribute)'],
  addPIClass: ['tblPIClass', 10, '(reportclass_id, unit, caption, pitype_1_id, pitype_2_id, pitype_3_id, user_provider, user_owner, user_reviewer, attribute)'],
  createPI: ['tblPI', 8, '(piclass_id, report_id, unit, caption, user_provider, user_owner, user_reviewer, attribute)'],
  setPIValue: ['tblPIValue', 6, '(pi_id, value, time_update, user_update, ip_user , attribute)'],
  setPITarget: ['tblPITarget', 7, '(pi_id, value, time_target, time_update, user_update , ip_user, attribute)'],
  sendMeggesge: ['tblMessage', 7, '(textmessage, time_message, ip_sender, user_sender, user_reciever, pi_id, time_read, attribute)']
};
const selectvalidator = {
  selectUser: ['tblUser', 'account']
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
              data._tbl = insertvalidverbs[verb][0];
              data._clmc = insertvalidverbs[verb][1];
              data._clms = insertvalidverbs[verb][2];
              if (!config.get('couldCreateAdmin')) {
                  if (verb === 'addUser') {
                    data.sysadmin = false;
                  }
              }
              resolve(data);
          }
    });
};
exports.validateSelect = function (verb, data) {
    return new Promise((resolve, reject) => {
          if (!selectvalidator.hasOwnProperty(verb)) {
              reject('validateForInsert failed, ' + verb + ' not exists');
          } else {
              data._tbl = selectvalidator[verb][0];
              data._where = selectvalidator[verb][1];
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
