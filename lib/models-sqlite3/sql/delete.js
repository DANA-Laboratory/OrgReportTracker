exports.deleteAll = function (/*basedb*/ db, data) {
    if(('_where' in data) && (data._where in data)) {
        if (data._tbl !== 'tblUser') {
          return db.pRun(`DELETE From ${data._tbl} WHERE ${data._where}='${data[data._where]}';`);
        } else {
          return db.pRun(`DELETE From tblUser WHERE sysadmin='false' AND ${data._where}='${data[data._where]}';`);
        }
    } else {
        return db.pRun(`DELETE From ${data._tbl};`);
    }
};
