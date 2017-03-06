exports.selectAll = function (db, data) {
    if (data.hasOwnProperty(data._where)) {
      return db.pGet(`SELECT * FROM ${data._tbl} WHERE ${data._where}=?;`, [data[data._where]]);
    } else {
      return db.pAll(`SELECT * FROM ${data._tbl};`);
    }
};
