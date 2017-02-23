exports.selectUser = function (db, data) {
    return db.pGet(`SELECT * FROM ${data._tbl} WHERE ${data._where}=?;`, [data[data._where]]);
};
