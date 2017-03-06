exports.selectAll = function(/*basedb*/ db, data) {
  if(data.hasOwnProperty(data._where)) {
    return db.pGet(`SELECT * FROM ${data._tbl} WHERE ${data._where}=?;`, [data[data._where]]);
  } else {
    return db.pAll(`SELECT * FROM ${data._tbl};`);
  }
};
exports.idforaccount = function(/*basedb*/ db, account) {
  return new Promise((resolve, reject) => {
    db.pGet(`SELECT id FROM tblUser WHERE account='${account}';`).then((data)=>resolve(data.id)).catch(reject);
  });
};
