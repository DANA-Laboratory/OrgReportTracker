const config = require('config');
const insertvalidverbs = {
/*
  caption TEXT Not Null, time_limit INTEGER Not Null, user_owner INTEGER Not Null REFERENCES tblUser (id), user_creator INTEGER Not Null REFERENCES tblUser (id), ip_user TEXT Not Null, time_create INTEGER Not Null, pathfile TEXT, time_latestissue INTEGER, attribute TEXT);\
  */
  addUser: ['tblUser', ['account', 'password', 'fname', 'lname', 'pcode', 'workunit', 'sysadmin', 'github', 'telegram'], ['attribute']],
  addReportClass: ['tblReportClass', ['caption', 'duration', 'user_owner', 'caption_pitypes', 'weight_pitypes'], ['attribute']],
  addVariableCat_1: ['tblVariableCat_1',['caption', 'code'], ['attribute']],
  addVariableCat_2: ['tblVariableCat_2', ['caption', 'code', 'variablecat_1_id'], ['attribute']],
  addVariableCat_3: ['tblVariableCat_3', ['caption', 'code', 'variablecat_2_id'], ['attribute']],
  addVariableDef: ['tblVariableDef', ['unit', 'caption', 'code'], ['user_provider', 'user_owner', 'user_reviewer', 'attribute']],
  addReportClassVariable: ['tblReportClassVariable', ['reportclass_id', 'variabledef_id'], ['variableCat_3_id', 'weight']],
  addReport: ['tblReport', ['reportclass_id', 'time_limit', 'user_creator', 'ip_user', 'pathfile', 'title'], ['pathfile', 'attribute']],
  addVariable: ['tblVariable', ['variabledef_id'], ['user_provider', 'user_owner', 'user_reviewer', 'attribute']],
  addReportVariable: ['tblReportVariable', ['report_id', 'variable_id'], ['weight']],
  addAttachment: ['tblAttachmentClass', ['variable_id', 'pathfile', 'user_attach', 'ip_user', 'time_attach'], ['attribute']],
  addValue: ['tblPIValue', ['variable_id', 'value', 'time_update', 'user_update', 'ip_user'], ['base', 'attribute']],
  addTarget: ['tblPITarget', ['variable_id', 'value', 'time_target', 'time_update', 'user_update' , 'ip_user'], ['attribute']],
  addMeggesge: ['tblMessage', ['textmessage', 'time_message', 'ip_sender', 'user_sender', 'user_reciever'], ['variable_id', 'time_read', 'attribute']]
};
const deletevalidverbs = {
  deleteAllUsers: ['tblUser'],
  deleteAllReportClasses: ['tblReportClass'],
  removeAllReportClassVariables: ['tblReportClassVariable'],
  deleteAllVariables: ['tblVariableDef'],
  restfulSelectables= ['tblUser', 'tblReportClass', 'tblVariableCat_1', 'tblVariableCat_2',
    'tblVariableCat_3', 'tblVariableDef'
  ],
};
const selectvalidator = {
  selectUser: ['tblUser', 'account', 'selectAll'],
  selectReportClass: ['tblReportClass', 'caption', 'selectAll'],
  selectId:  {tblUser: 'account', tblReportClass: 'caption', tblVariableCat_1: 'caption', tblVariableCat_2: 'caption', tblVariableCat_3: 'caption', tblVariableDef: 'caption'},
};
exports.validateInsert = function (data) {
    return new Promise((resolve, reject) => {
        try {
          data = exports.fvalidateInsert(data._verb, data);
          resolve(data);
        } catch(err) {
          reject(err);
        }
    });
};
exports.fvalidateInsert = function (verb, data) {
    data._verb = verb;
    if (!(verb in insertvalidverbs)) {
        throw('validateForInsert failed, ' + verb + ' not exists');
    } else {
        data._tbl = insertvalidverbs[verb][0];
        data._clmc = (insertvalidverbs[verb][1]).length;
        data._clms = '(' + (insertvalidverbs[verb][1]).toString() + ')';
        data._uclms = insertvalidverbs[verb][2];
        if (!config.get('couldCreateAdmin')) {
            if (verb === 'addUser') {
                data.sysadmin = false;
            }
        }
        return(data);
    }
};
exports.validateUpdate= function (data) {
    return new Promise((resolve, reject) => {
        if(('_verb' in data) && (data._verb==='update') && ('_tbl' in data) && ('_clm' in data) && (data._clm in data)) {
            resolve(data);
        } else {
            reject(`validateUpdate failed, to call "update" verb with ${data}`);
        }
    });
};
exports.validateSelect = function (data) {
    console.log(data);
    let verb = data._verb;
    return new Promise((resolve, reject) => {
        if (verb in selectvalidator) {
            if (verb === 'selectId') {
                data._where = ('_where' in data ? data._where : (selectvalidator.selectId[data._tbl] in data ? selectvalidator.selectId[data._tbl] : undefined));
            } else {
                data._tbl = selectvalidator[verb][0];
                if(selectvalidator[verb][1] in data) {
                    data._where = selectvalidator[verb][1];
                }
                data._verb = selectvalidator[verb][2];
                resolve(data);
            }
        } else {
            insertvalidverbs.for
        } else {
            reject('validateSelect failed, ' + verb + ' not exists data=' +  JSON.stringify(data));
        }
    });
};
exports.validateDelete = function (data) {
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
