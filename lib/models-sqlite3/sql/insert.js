const sqlSelect = require('./select.js');
function values(len) {
  var str = 'VALUES (';
  for (var i=1; i<len; i++) {
    str += '?, ';
  }
  str += '?)';
  return str;
}

exports.addUser = function (/*basedb*/ db, data) {
    return require('bcrypt').hash(data.password, 10).then(function(hash) {
      db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.account, hash, data.fname, data.lname, data.pcode, data.workunit, data.sysadmin]);
    }).catch((err)=>{
      return Promise.reject('addUser() fails to encrypt pass with ' + err);
    });
};
exports.addReportClass = function (/*basedb*/ db, data) {
    return new Promise((resolve, reject) => {
        sqlSelect.idfordata(db, {_tbl:'tblUser' , _where:'account', account:data.user_owner}).then((owner_id)=>{
          db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.caption, data.duration, owner_id, data.caption_pitype_1, data.caption_pitype_2, data.caption_pitype_3]).then(resolve).catch(reject);
        }).catch((err)=>{
          reject('addReportClass() fails to find owner ' + err);
        });
    });
};
exports.addPIType_1 = function (/*basedb*/ db, data) {
    return db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.caption, data.code]);
};
exports.addPIType_2 = function (/*basedb*/ db, data) {
  return new Promise((resolve, reject) => {
      sqlSelect.idfordata(db, {_tbl:'tblPIType_1' , _where:'caption', caption:data.pitype_1_id}).then((pitype_1_id)=>{
        db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.caption, data.code, pitype_1_id]).then(resolve).catch(reject);
      }).catch((err)=>{
        reject('addPIType_2() fails with: ' + err);
      });
  });
};
exports.addPIType_3 = function (/*basedb*/ db, data) {
  console.log(data);
  return new Promise((resolve, reject) => {
      sqlSelect.idfordata(db, {_tbl:'tblPIType_2' , _where:'caption', caption:data.pitype_2_id}).then((pitype_2_id)=>{
        db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.caption, data.code, pitype_2_id]).then(resolve).catch(reject);
      }).catch((err)=>{
        reject('addPIType_3() fails with: ' + err);
      });
  });
};
exports.createReport = function (/*basedb*/ db, data) {
    return db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.reportclass_id, data.caption, data.time_limit, data.user_owner, data.user_creator, data.ip_user, data.time_create, data.pathfile, data.time_latestissue, data.attribute]);
};
exports.addAttachment = function (/*basedb*/ db, data) {
    return db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.report_id, data.pathfile, data.user_attach, data.ip_user, data.time_attach, data.attribute]);
};
exports.addPIClass = function (/*basedb*/ db, data) {
    return db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.reportclass_id, data.unit, data.caption, data.code, data.pitype_1_id, data.pitype_2_id, data.pitype_3_id, data.user_provider, data.user_owner, data.user_reviewer, data.attribute]);
};
exports.createPI = function (/*basedb*/ db, data) {
    return db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.piclass_id, data.report_id, data.unit, data.caption, data.user_provider, data.user_owner, data.user_reviewer, data.attribute]);
};
exports.setPIValue = function (/*basedb*/ db, data) {
    return db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.pi_id, data.value, data.time_update, data.user_update, data.ip_user , data.attribute]);
};
exports.setPITarget = function (/*basedb*/ db, data) {
    return db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.pi_id, data.value, data.time_target, data.time_update, data.user_update , data.ip_user, data.attribute]);
};
exports.sendMeggesge = function (/*basedb*/ db, data) {
    return db.pRun(`INSERT INTO ${data._tbl} ${data._clms} ${values(data._clmc)};`, [data.textmessage, data.time_message, data.ip_sender, data.user_sender, data.user_reciever, data.pi_id, data.time_read, data.attribute]);
};
