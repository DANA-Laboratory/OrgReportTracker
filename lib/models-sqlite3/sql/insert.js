'use strict';
function values(len) {
  var str = 'VALUES (';
  for (var i=1; i<len; i++) {
    str += '?, ';
  }
  str += '?)';
  return str;
}

exports.addUser = function (db, data) {
    return db.pRun(`INSERT INTO ${data.tbl} (account, password, fname, lname, pcode, workunit, sysadmin, attribute) ${values(data.clmc)};`, [data.account, data.password, data.fname, data.lname, data.pcode, data.workunit, data.sysadmin, data.attribute]);
};
exports.addReportClass = function (db, data) {
    return db.pRun(`INSERT INTO ${data.tbl} (caption, dayduration, user_owner, attribute) ${values(data.clmc)};`, [data.caption, data.dayduration, data.user_owner, data.attribute]);
};
exports.createReport = function (db, data) {
    return db.pRun(`INSERT INTO ${data.tbl} (reportclass_id, caption, time_limit, user_owner, user_creator, ip_user, time_create, pathfile, time_latestissue, attribute) ${values(data.clmc)};`, [data.reportclass_id, data.caption, data.time_limit, data.user_owner, data.user_creator, data.ip_user, data.time_create, data.pathfile, data.time_latestissue, data.attribute]);
};
exports.addAttachment = function (db, data) {
    return db.pRun(`INSERT INTO ${data.tbl} (report_id, pathfile, user_attach, ip_user, time_attach, attribute) ${values(data.clmc)};`, [data.report_id, data.pathfile, data.user_attach, data.ip_user, data.time_attach, data.attribute]);
};
exports.addPIType_1 = function (db, data) {
    return db.pRun(`INSERT INTO ${data.tbl} (caption, attribute) ${values(data.clmc)};`, [data.caption, data.attribute]);
};
exports.addPIType_2 = function (db, data) {
    return db.pRun(`INSERT INTO ${data.tbl} (caption, pitype_1_id , attribute) ${values(data.clmc)};`, [data.caption, data.pitype_1_id , data.attribute]);
};
exports.addPIType_3 = function (db, data) {
    return db.pRun(`INSERT INTO ${data.tbl} (caption, pitype_2_id , attribute) ${values(data.clmc)};`, [data.caption, data.pitype_2_id , data.attribute]);
};
exports.addPIClass = function (db, data) {
    return db.pRun(`INSERT INTO ${data.tbl} (reportclass_id, unit, caption, pitype_1_id, pitype_2_id, pitype_3_id, user_provider, user_owner, user_reviewer, attribute) ${values(data.clmc)};`, [data.reportclass_id, data.unit, data.caption, data.pitype_1_id, data.pitype_2_id, data.pitype_3_id, data.user_provider, data.user_owner, data.user_reviewer, data.attribute]);
};
exports.createPI = function (db, data) {
    return db.pRun(`INSERT INTO ${data.tbl} (piclass_id, report_id, unit, caption, user_provider, user_owner, user_reviewer, attribute) ${values(data.clmc)};`, [data.piclass_id, data.report_id, data.unit, data.caption, data.user_provider, data.user_owner, data.user_reviewer, data.attribute]);
};
exports.setPIValue = function (db, data) {
    return db.pRun(`INSERT INTO ${data.tbl} (pi_id, value, time_update, user_update, ip_user , attribute) ${values(data.clmc)};`, [data.pi_id, data.value, data.time_update, data.user_update, data.ip_user , data.attribute]);
};
exports.setPITarget = function (db, data) {
    return db.pRun(`INSERT INTO ${data.tbl} (pi_id, value, time_target, time_update, user_update , ip_user, attribute) ${values(data.clmc)};`, [data.pi_id, data.value, data.time_target, data.time_update, data.user_update , data.ip_user, data.attribute]);
};
exports.sendMeggesge = function (db, data) {
    return db.pRun(`INSERT INTO ${data.tbl} (textmessage, time_message, ip_sender, user_sender, user_reciever, pi_id, time_read, attribute) ${values(data.clmc)};`, [data.textmessage, data.time_message, data.ip_sender, data.user_sender, data.user_reciever, data.pi_id, data.time_read, data.attribute]);
};
