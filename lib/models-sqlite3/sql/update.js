const sqlSelect = require('./select.js');
exports.update = function (/*basedb*/ db, data) {
    return db.pRun(`UPDATE ${data._tbl} SET ${data._clm}=${data[data._clm]} WHERE ${data._where}=\'${data[data._where]}\';`);
};
exports.update_2 = function (/*basedb*/ db, data) {
    return db.pRun(`UPDATE ${data._tbl} SET ${data._clm}=${data[data._clm]} WHERE ${data._where_1}=\'${data[data._where_1]}\' AND ${data._where_2}=\'${data[data._where_2]}\';`);
};
exports.updateReportClassVariableSetCat_3 = function (/*basedb*/ db, data) {
  return new Promise((resolve, reject) => {
      var p1 = (Number.isInteger(data.variabledef_id)) ? Promise.resolve(data.variabledef_id) : sqlSelect.idfordata(db, {_tbl:'tblVariableDef', _where:'caption', caption:data.variabledef_id});
      var p2 = (Number.isInteger(data.reportclass_id)) ? Promise.resolve(data.reportclass_id) : sqlSelect.idfordata(db, {_tbl:'tblReportClass', _where:'caption', caption:data.reportclass_id});
      var p3 = (Number.isInteger(data.variablecat_3_id)) ? Promise.resolve(data.variablecat_3_id) : sqlSelect.idfordata(db, {_tbl:'tblVariableCat_3', _where:'caption', caption:data.variablecat_3_id});
      data._tbl = 'tblReportClassVariable';
      data._clm = 'variablecat_3_id';
      data._where_1 = 'variabledef_id';
      data._where_2 = 'reportclass_id';
      Promise.all([p1, p2, p3]).then((resolves)=>{
          [data.variabledef_id, data.reportclass_id, data.variablecat_3_id] = resolves;
          exports.update_2(db, data).then(resolve);
      }).catch((err)=>{
        reject('updateReportClassVariable() fails to find related records with: ' + err);
      });
  });
};
