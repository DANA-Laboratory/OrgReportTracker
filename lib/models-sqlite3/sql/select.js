exports.selectAll = function(/*basedb*/ db, data) {
    if(('_where' in data) && (data._where in data)) {
        return db.pGet(`SELECT * FROM ${data._tbl} WHERE ${data._where}='${data[data._where]}';`);
    } else {
        return db.pAll(`SELECT * FROM ${data._tbl};`);
    }
};
// find id
// 1- if _where in data then data._where=data[data._where]
// 2- else if _where not exists then validateidfordata[data._tbl] must be there
// 3- else it returns all
var validateidfordata = {tblUser: 'account', tblReportClass: 'caption', tblPIType_1: 'caption', tblPIType_2: 'caption', tblPIType_3: 'caption', tblVariableDef: 'caption'};
exports.idfordata= function(/*basedb*/ db, data) {
    return new Promise((resolve, reject) => {
        data._where = ('_where' in data ? data._where : (validateidfordata[data._tbl] in data ? validateidfordata[data._tbl] : resolve(db.pAll(`SELECT * FROM ${data._tbl};`))));
        db.pGet(`SELECT id FROM ${data._tbl} WHERE ${data._where}='${data[data._where]}';`).then((res)=>{
            if(res) {
                resolve(res.id);
            } else {
                reject(`select id fails with: could not find id where ${data._where}='${data[data._where]}' in ${data._tbl}`);
            }
        }).catch(reject);
    });
};
