exports.update = function (/*basedb*/ db, data) {
    return db.pRun(`UPDATE ${data._tbl} SET ${data._clm}=${data[data._clm]} WHERE ${data._where}=\'${data[data._where]}\';`);
};
exports.update_2 = function (/*basedb*/ db, data) {
    return db.pRun(`UPDATE ${data._tbl} SET ${data._clm}=${data[data._clm]} WHERE ${data._where_1}=\'${data[data._where_1]}\' AND ${data._where_2}=\'${data[data._where_2]}\';`);
};
