exports.selectAll = function(/*basedb*/ db, data) {
    if(data.hasOwnProperty(data._where)) {
        return db.pGet(`SELECT * FROM ${data._tbl} WHERE ${data._where}='${data[data._where]}';`);
    } else {
        return db.pAll(`SELECT * FROM ${data._tbl};`);
    }
};
var validateidfordata = {tblUser: 'account', tblReportClass: 'caption', tblPIType_1: 'caption', tblPIType_2: 'caption', tblPIType_3: 'caption', tblVariableDef: 'caption'};
exports.idfordata= function(/*basedb*/ db, data) {
    return new Promise((resolve, reject) => {
        data._where = ('_where' in data ? data._where : (validateidfordata[data._tbl] in data ? validateidfordata[data._tbl] : reject(`idfordata failed with: both data._where and data.${validateidfordata[data._tbl]} are undifined`)));
        db.pGet(`SELECT id FROM ${data._tbl} WHERE ${data._where}='${data[data._where]}';`).then((res)=>{
            if(res) {
                resolve(res.id);
            } else {
                reject(`select id fails with: could not find id where ${data._where}='${data[data._where]}' in ${data._tbl}`);
            }
        }).catch(reject);
    });
};
