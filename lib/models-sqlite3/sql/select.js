exports.selectAll = function(/*basedb*/ db, data) {
  if(data.hasOwnProperty(data._where)) {
    return db.pGet(`SELECT * FROM ${data._tbl} WHERE ${data._where}=?;`, [data[data._where]]);
  } else {
    return db.pAll(`SELECT * FROM ${data._tbl};`);
  }
};
exports.idfordata= function(/*basedb*/ db, data) {
  return new Promise((resolve, reject) => {
    db.pGet(`SELECT id FROM ${data._tbl} WHERE ${data._where}='${data[data._where]}';`).then((res)=>{
      if(res) {
        resolve(res.id);
      } else {
        reject(`select id fails with: could not find id where ${data._where}='${data[data._where]}' in ${data._tbl}`);
      }
    }).catch(reject);
  });
};
