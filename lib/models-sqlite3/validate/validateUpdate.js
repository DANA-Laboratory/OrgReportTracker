const sqlSelect = require('../sql/select.js');
// update validator
const updatevalidverbs = {
  updateReportClassVariableSetCat_3: {
    _tbl: 'tblReportClassVariable',
    _clm: 'variablecat_3_id',
    _where_1: 'variabledef_id',
    _where_2: 'reportclass_id',
    _verb: 'update_2'
  }
};
exports.validate = function (db, data) {
    return new Promise((resolve, reject) => {
        //pre define verbs
        if(data._verb in updatevalidverbs) {
            // solve relations
            if (data._verb == 'updateReportClassVariableSetCat_3') {
                var p1 = (Number.isInteger(data.variabledef_id)) ? Promise.resolve(data.variabledef_id) : sqlSelect.idfordata(db, {_tbl:'tblVariableDef', _where:'caption', caption:data.variabledef_id});
                var p2 = (Number.isInteger(data.reportclass_id)) ? Promise.resolve(data.reportclass_id) : sqlSelect.idfordata(db, {_tbl:'tblReportClass', _where:'caption', caption:data.reportclass_id});
                var p3 = (Number.isInteger(data.variablecat_3_id)) ? Promise.resolve(data.variablecat_3_id) : sqlSelect.idfordata(db, {_tbl:'tblVariableCat_3', _where:'caption', caption:data.variablecat_3_id});
                Promise.all([p1, p2, p3]).then((resolves)=>{
                    [data.variabledef_id, data.reportclass_id, data.variablecat_3_id] = resolves;
                    resolve(data);
                }).catch((err)=>{
                    reject('updateReportClassVariable fails to find related records with: ' + err);
                });
            }
            // merge key data
            for(key in updatevalidverbs) {
               if(updatevalidverbs.hasOwnProperty(key)) {
                  data[key]=updatevalidverbs[key];
               }
            }
        } else {
            if(('_verb' in data) && (data._verb==='update') && ('_tbl' in data) && ('_clm' in data) && (data._clm in data)) {
                resolve(data);
            } else {
                reject(`validateUpdate failed, to call "update" verb with ${data}`);
            }
        }
    });
};
/*
exports.updateReportClassVariableSetCat_3 = function (basedb db, data) {
  return new Promise((resolve, reject) => {
      var p1 = (Number.isInteger(data.variabledef_id)) ? Promise.resolve(data.variabledef_id) : sqlSelect.idfordata(db, {_tbl:'tblVariableDef', _where:'caption', caption:data.variabledef_id});
      var p2 = (Number.isInteger(data.reportclass_id)) ? Promise.resolve(data.reportclass_id) : sqlSelect.idfordata(db, {_tbl:'tblReportClass', _where:'caption', caption:data.reportclass_id});
      var p3 = (Number.isInteger(data.variablecat_3_id)) ? Promise.resolve(data.variablecat_3_id) : sqlSelect.idfordata(db, {_tbl:'tblVariableCat_3', _where:'caption', caption:data.variablecat_3_id});
      Promise.all([p1, p2, p3]).then((resolves)=>{
          [data.variabledef_id, data.reportclass_id, data.variablecat_3_id] = resolves;
          exports.update_2(db, data).then(resolve);
      }).catch((err)=>{
        reject('updateReportClassVariable() fails to find related records with: ' + err);
      });
  });
};
*/
