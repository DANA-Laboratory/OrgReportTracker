exports.update = function (/*basedb*/ db, data) {
    return db.pRun(`UPDATE ${data._tbl} SET ${data._clm}=${data[data._clm]} WHERE ${data._where}=\'${data[data._where]}\';`);
};
exports.update_2 = function (/*basedb*/ db, data) {
    return db.pRun(`UPDATE ${data._tbl} SET ${data._clm}=${data[data._clm]} WHERE ${data._where_1}=\'${data[data._where_1]}\' AND ${data._where_2}=\'${data[data._where_2]}\';`);
};
exports.updatemultiple = function (/*basedb*/ db, data) {
  var q = '';
  for(var k in data) {
    if(data.hasOwnProperty(k) && k[0] !== '_') {
      if(typeof(data[k])==='number') {
        q += `${k}=${data[k]}, `;
      } else {
        q += `${k}='${data[k]}', `;
      }
    };
  };
  q = q.substr(0, q.length-2);
  console.log(`UPDATE ${data._tbl} SET ${q} WHERE ${data._where}=\'${data._value}\';`);
  return db.pRun(`UPDATE ${data._tbl} SET ${q} WHERE ${data._where}=\'${data._value}\';`);
};
