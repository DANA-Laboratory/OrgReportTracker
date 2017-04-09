const sqlSelect = require('./select.js');
/*
  All basic insert codes will come here. Inserts are minimal means only mandatory (not null) fields will insert.
  each function will inserts one new row into only one table. No log here.
  for tables with relation if FOREIGN_KEY  is not an Integer, function trys to find an integer id for it.
  addTableName(db, data) inserts data into TableName
  all keys with a _ before contains internal data
  data._clms are column names
  data._ip ip value of remote computer
  data._user user account
  data._tbl table name
*/
function values(len) {
  var str = 'VALUES (';
  for (var i=1; i<len; i++) {
    str += '?, ';
  }
  str += '?)';
  return str;
}
const bcrypt = require('bcrypt-nodejs');

exports.addUser = function (/*basedb*/ db, data) {
    return db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.account, bcrypt.hashSync(data.password), data.fname, data.lname, data.pcode, data.workunit, data.sysadmin, data.github, data.telegram]);
};
exports.addReportClass = function (/*basedb*/ db, data) {
    return new Promise((resolve, reject) => {
        var p = (Number.isInteger(data.user_owner) ? Promise.resolve(data.user_owner) : sqlSelect.idfordata(db, {_tbl:'tblUser', _where: 'account', account:data.user_owner}));
        p.then((owner_id)=>{
          db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.caption, data.duration, owner_id, data.caption_pitypes, data.weight_pitypes]).then(resolve).catch(reject);
        }).catch((err)=>{
          reject('addReportClass() fails to find owner ' + err);
        });
    });
};
exports.addVariableCat_1 = function (/*basedb*/ db, data) {
    return db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.caption, data.code]);
};
exports.addVariableCat_2 = function (/*basedb*/ db, data) {
  return new Promise((resolve, reject) => {
      var p = (Number.isInteger(data.variablecat_1_id)) ? Promise.resolve(data.variablecat_1_id) : sqlSelect.idfordata(db, {_tbl:'tblVariableCat_1', _where: 'caption', caption:data.variablecat_1_id});
      p.then((VariableCat_1_id)=>{
        db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.caption, data.code, VariableCat_1_id]).then(resolve).catch(reject);
      }).catch((err)=>{
        reject('addVariableCat_2() fails with: ' + err);
      });
  });
};
exports.addVariableCat_3 = function (/*basedb*/ db, data) {
  return new Promise((resolve, reject) => {
      var p = (Number.isInteger(data.variablecat_2_id)) ? Promise.resolve(data.variablecat_2_id) : sqlSelect.idfordata(db, {_tbl:'tblVariableCat_2', caption:data.variablecat_2_id});
      p.then((VariableCat_2_id)=>{
        db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.caption, data.code, VariableCat_2_id]).then(resolve).catch(reject);
      }).catch((err)=>{
        reject('addVariableCat_3() fails to fined related records with: ' + err);
      });
  });
};
exports.addVariableDef = function (/*basedb*/ db, data) {
    return db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.unit, data.caption, data.code]);
};
exports.addReportClassVariable = function (/*basedb*/ db, data) {
  return new Promise((resolve, reject) => {
      var p1 = (Number.isInteger(data.variabledef_id)) ? Promise.resolve(data.variabledef_id) : sqlSelect.idfordata(db, {_tbl:'tblVariableDef', _where:'caption', caption:data.variabledef_id});
      var p2 = (Number.isInteger(data.reportclass_id)) ? Promise.resolve(data.reportclass_id) : sqlSelect.idfordata(db, {_tbl:'tblReportClass', _where:'caption', caption:data.reportclass_id});
      Promise.all([p1, p2]).then(([variabledef_id, reportclass_id])=>{
          db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [reportclass_id, variabledef_id]).then(resolve).catch(reject);
      }).catch((err)=>{
        reject('addReportClassVariable() fails to find related records with: ' + err);
      });
  });
};

exports.addReport = function (/*basedb*/ db, data) {
    return db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.reportclass_id, data.caption, data.time_limit, data.user_owner, data.user_creator, data.ip_user, data.time_create, data.pathfile, data.time_latestissue, data.attribute]);
};
exports.addVariable = function (/*basedb*/ db, data) {
    return db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.piclass_id, data.report_id, data.unit, data.caption, data.user_provider, data.user_owner, data.user_reviewer, data.attribute]);
};
exports.addReportVariable = function (/*basedb*/ db, data) {
    //TODO
}
exports.addAttachment = function (/*basedb*/ db, data) {
    return db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.report_id, data.pathfile, data.user_attach, data.ip_user, data.time_attach, data.attribute]);
};
exports.addValue = function (/*basedb*/ db, data) {
    return db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.pi_id, data.value, data.time_update, data.user_update, data.ip_user , data.attribute]);
};
exports.addTarget = function (/*basedb*/ db, data) {
    return db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.pi_id, data.value, data.time_target, data.time_update, data.user_update , data.ip_user, data.attribute]);
};
exports.addMessage = function (/*basedb*/ db, data) {
    return db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.textmessage, data.time_message, data.ip_sender, data.user_sender, data.user_reciever, data.pi_id, data.time_read, data.attribute]);
};
