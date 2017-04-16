// update validator
exports.validate = function (data) {
    return new Promise((resolve, reject) => {
        if(('_verb' in data) && (data._verb==='update') && ('_tbl' in data) && ('_clm' in data) && (data._clm in data)) {
            resolve(data);
        } else {
            reject(`validateUpdate failed, to call "update" verb with ${data}`);
        }
    });
};
