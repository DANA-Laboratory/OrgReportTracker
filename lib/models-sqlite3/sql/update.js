exports.update = function (/*basedb*/ db, data) {
    return db.pRun(`UPDATE ${data._tbl} SET ${data._clm}=${data[data._clm]};`);
};
