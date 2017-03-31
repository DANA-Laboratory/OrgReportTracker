const config = require('config');
const insertvalidverbs = {
  addUser: ['tblUser', 9, '(account, password, fname, lname, pcode, workunit, sysadmin, github, telegram)'],
  addReportClass: ['tblReportClass', 5, '(caption, duration, user_owner, caption_pitypes, weight_pitypes)'],
  addPIType_1: ['tblPIType_1', 2, '(caption, code)'],
  addPIType_2: ['tblPIType_2', 3, '(caption, code, pitype_1_id)'],
  addPIType_3: ['tblPIType_3', 3, '(caption, code, pitype_2_id)'],
  addVariableDef: ['tblVariableDef', 3, '(unit, caption, code)'],
  addReportVariable: ['tblJunctionClass', 2,'(reportclass_id, variabledef_id)'],
  createReport: ['tblReport', 6, '(reportclass_id, time_limit, user_creator, ip_user, pathfile, time_latestissue)'],
  addAttachment: ['tblAttachmentClass', 5, '(report_id, pathfile, user_attach, ip_user, time_attach)'],
  setPIValue: ['tblPIValue', 5, '(pi_id, value, time_update, user_update, ip_user)'],
  setPITarget: ['tblPITarget', 6, '(pi_id, value, time_target, time_update, user_update , ip_user)'],
  sendMeggesge: ['tblMessage', 6, '(textmessage, time_message, ip_sender, user_sender, user_reciever, pi_id, time_read)']
};
const deletevalidverbs = {
  deleteAllUsers: ['tblUser'],
  deleteAllReportClasses: ['tblReportClass'],
  removeAllVariables: ['tblJunctionClass'],
  deleteAllVariables: ['tblVariableDef']
};
const selectvalidator = {
  selectUser: ['tblUser', 'account', 'selectAll'],
  selectReportClass: ['tblReportClass', 'caption', 'selectAll']
};
exports.validateInsert = function (data) {
    return new Promise((resolve, reject) => {
        try {
          data = exports.fvalidateInsert(data._verb, data);
          resolve(data);
        } catch(err) {
          reject(err);
        }
    });
};
exports.fvalidateInsert = function (verb, data) {
    data._verb = verb;
    if (!(verb in insertvalidverbs)) {
        throw('validateForInsert failed, ' + verb + ' not exists');
    } else {
        data._tbl = insertvalidverbs[verb][0];
        data._clmc = insertvalidverbs[verb][1];
        data._clms = insertvalidverbs[verb][2];
        if (!config.get('couldCreateAdmin')) {
            if (verb === 'addUser') {
                data.sysadmin = false;
            }
        }
        return(data);
    }
};
exports.validateUpdate= function (data) {
    return new Promise((resolve, reject) => {
        if(('_verb' in data) && (data._verb==='update') && ('_tbl' in data) && ('_clm' in data) && (data._clm in data)) {
            resolve(data);
        } else {
            reject(`validateUpdate failed, to call "update" verb with ${data}`);
        }
    });
};
exports.validateSelect = function (data) {
    let verb = data._verb;
    return new Promise((resolve, reject) => {
          if (verb in selectvalidator) {
              data._tbl = selectvalidator[verb][0];
              data._where = selectvalidator[verb][1];
              data._verb = selectvalidator[verb][2];
              resolve(data);
          } else {
              reject('validateSelect failed, ' + verb + ' not exists');
          }
    });
};
exports.validateDelete = function (data) {
    let verb = data._verb;
    return new Promise((resolve, reject) => {
          if (!deletevalidverbs.hasOwnProperty(verb)) {
              reject('validateDelete failed, ' + verb + ' not exists');
          } else {
              data._verb = 'deleteAll';
              data._tbl = deletevalidverbs[verb][0];
              resolve(data);
          }
    });
};
