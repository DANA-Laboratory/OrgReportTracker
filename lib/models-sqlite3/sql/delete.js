exports.deleteAllUsers = function (/*basedb*/ db, data) {
    return db.pRun(`Delete From ${data._tbl};`);
};
