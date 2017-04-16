const deletevalidverbs = {
  deleteAllUsers: ['tblUser'],
  deleteAllReportClasses: ['tblReportClass'],
  removeAllReportClassVariables: ['tblReportClassVariable'],
  deleteAllVariables: ['tblVariableDef'],
};
//delete validator
exports.validate = function (data) {
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
};
