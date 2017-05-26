const deletevalidverbs = {
  deleteAllUsers: ['tblUser'],
  deleteAllReportClasses: ['tblReportClass'],
  removeAllReportClassVariables: ['tblReportClassVariable'],
  deleteAllVariables: ['tblVariableDef'],
};
//delete validator
exports.validate = function (data) {
    if (data._tbl !== undefined) {
        data._verb = 'deleteAll';
        if (data._tbl === 'tblvVariableDef') {
          data._tbl = 'tblVariableDef';
        }
        return Promise.resolve(data);
    } else {
        let verb = data._verb;
        return new Promise((resolve, reject) => {
              if (!(verb in deletevalidverbs)) {
                  reject('validateDelete failed, ' + verb + ' not exists');
              } else {
                  data._verb = 'deleteAll';
                  data._tbl = deletevalidverbs[verb][0];
                  resolve(data);
              }
        });
    }
};
