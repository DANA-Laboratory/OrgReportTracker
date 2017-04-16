const selectvalidator = {
  selectUser: {_tbl:'tblUser', _where:'account', _verb:'selectAll'},
  selectReportClass: {_tbl:'tblReportClass', _where:'caption', _verb:'selectAll'},
  selectId:  {tblUser: 'account', tblReportClass: 'caption', tblVariableCat_1: 'caption', tblVariableCat_2: 'caption', tblVariableCat_3: 'caption', tblVariableDef: 'caption'},
  restfulGet: [
    'tblUser', 'tblReportClass', 'tblVariableCat_1',
    'tblVariableCat_2', 'tblVariableCat_3', 'tblVariableDef',
  ],
};
//select validator
exports.validate = function (data) {
    let verb = data._verb;
    return new Promise((resolve, reject) => {
        if (verb in selectvalidator) {
            if (verb === 'selectId') {
                data._where = ('_where' in data ? data._where : (selectvalidator.selectId[data._tbl] in data ? selectvalidator.selectId[data._tbl] : undefined));
            } else {
                data._tbl = selectvalidator[verb]._tbl;
                if(selectvalidator[verb]._where in data) {
                    data._where = selectvalidator[verb]._where;
                }
                data._verb = selectvalidator[verb]._verb;
                resolve(data);
            }
        } else if (selectvalidator.restfulGet.indexOf(data._tbl)>=0) {
            data._verb = 'selectAll';
            resolve(data);
        } else {
            reject('validateSelect failed, ' + verb + ' not exists data=' +  JSON.stringify(data));
        }
    });
};
