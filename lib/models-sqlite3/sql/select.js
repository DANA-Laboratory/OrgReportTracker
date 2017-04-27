exports.selectAll = function(/*basedb*/ db, data) {
    if(('_where' in data) && (data._where in data)) {
        if (data._where === 'id') {
            return db.pGet(`SELECT * FROM ${data._tbl} WHERE ${data._where}='${data[data._where]}';`);
        } else {
            return db.pAll(`SELECT * FROM ${data._tbl} WHERE ${data._where}='${data[data._where]}';`);
        }
    } else {
        return db.pAll(`SELECT * FROM ${data._tbl};`);
    }
};
// find id
exports.idfordata= function(/*basedb*/ db, data) {
    return new Promise((resolve, reject) => {
        if (!('_where' in data)) {
            resolve(db.pAll(`SELECT id FROM ${data._tbl};`));
        } else {
            db.pGet(`SELECT id FROM ${data._tbl} WHERE ${data._where}='${data[data._where]}';`).then((res)=>{
              resolve(res.id);
            }).catch(reject);
        }
    });
};
exports.qryVariableDef = function(/*basedb*/ db, data) {
    if(('_where' in data) && (data._where in data)) {
        return db.pGet(`SELECT * FROM tblVariableDef LEFT OUTER JOIN tblReportClassVariable ON tblVariableDef.id = tblReportClassVariable.variabledef_id WHERE ${data._where}='${data[data._where]}';`);
    } else {
        return db.pAll(`SELECT * FROM tblVariableDef LEFT OUTER JOIN tblReportClassVariable ON tblVariableDef.id = tblReportClassVariable.variabledef_id;`);
    }
};
