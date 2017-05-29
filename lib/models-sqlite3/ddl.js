var fkey = function(tbl, notnull, userfield) {
  if(userfield !== undefined) {
      return (notnull ? 'user_' + userfield + ' INTEGER Not Null REFERENCES tbl' + tbl + ' (id)' : 'user_' + userfield + ' INTEGER REFERENCES tbl' + tbl + ' (id)');
  } else {
      return (notnull ? tbl.toLowerCase() + '_id INTEGER Not Null REFERENCES tbl' + tbl + ' (id)' : tbl.toLowerCase() + '_id INTEGER REFERENCES tbl' + tbl + ' (id)');
  }
};
module.exports = `\
    PRAGMA FOREIGN_KEYS = ON;\
    CREATE TABLE tblUser (id INTEGER PRIMARY KEY, account TEXT Not Null UNIQUE, password TEXT Not Null, fname TEXT Not Null, lname TEXT Not Null, pcode TEXT Not Null UNIQUE, workunit TEXT Not Null, sysadmin BOOLEAN Not Null, github TEXT, telegram TEXT, attribute TEXT);\
    CREATE TABLE tblReportClass (id INTEGER PRIMARY KEY, caption TEXT Not Null UNIQUE, duration TEXT Not Null, ${fkey('User', false, 'owner')}, caption_cat_1 TEXT Not Null, caption_cat_2 TEXT Not Null, caption_cat_3 TEXT Not Null, caption_variable TEXT Not Null, attribute TEXT);\
    CREATE TABLE tblVariableCat_1 (id INTEGER PRIMARY KEY, caption TEXT Not Null UNIQUE, code TEXT Not Null, weight DOUBLE Not Null, attribute TEXT);\
    CREATE TABLE tblVariableCat_2 (id INTEGER PRIMARY KEY, caption TEXT Not Null UNIQUE, code TEXT Not Null, ${fkey('VariableCat_1', false)}, weight DOUBLE Not Null, attribute TEXT);\
    CREATE TABLE tblVariableCat_3 (id INTEGER PRIMARY KEY, caption TEXT Not Null UNIQUE, code TEXT Not Null, ${fkey('VariableCat_2', false)}, weight DOUBLE Not Null, attribute TEXT);\
    CREATE TABLE tblVariableDef (id INTEGER PRIMARY KEY, unit TEXT Not Null, caption TEXT Not Null UNIQUE, code TEXT Not Null UNIQUE, ${fkey('User', false, 'provider')}, ${fkey('User', false, 'owner')}, ${fkey('User', false, 'reviewer')}, limit_lower DOUBLE, limit_upper DOUBLE, attribute TEXT);\
    CREATE TABLE tblReportClassVariable (id INTEGER PRIMARY KEY, ${fkey('ReportClass', true)}, ${fkey('VariableDef', true)}, ${fkey('VariableCat_3', false)}, weight DOUBLE Not Null);\
    CREATE TABLE tblReport (id INTEGER PRIMARY KEY, caption TEXT Not Null, title TEXT Not Null, time_limit INTEGER Not Null, ${fkey('User', true, 'owner')}, ${fkey('User', true, 'creator')}, ip_user TEXT Not Null, time_create INTEGER Not Null, pathfile TEXT, attribute TEXT);\
    CREATE TABLE tblVariable (id INTEGER PRIMARY KEY, unit TEXT Not Null, caption TEXT Not Null, code TEXT Not Null, ${fkey('User', true, 'provider')}, ${fkey('User', true, 'owner')}, ${fkey('User', true, 'reviewer')}, limit_lower DOUBLE, limit_upper DOUBLE, attribute TEXT);\
    CREATE TABLE tblReportVariable (id INTEGER PRIMARY KEY, ${fkey('Report', true)}, ${fkey('Variable', true)}, ${fkey('VariableCat_3', false)}, weight DOUBLE);\
    CREATE TABLE tblAttachment (id INTEGER PRIMARY KEY, ${fkey('Variable', true)}, pathfile TEXT Not Null, ${fkey('User', true, 'attach')}, ip_user TEXT Not Null, time_attach INTEGER Not Null, attribute TEXT);\
    CREATE TABLE tblValue (id INTEGER PRIMARY KEY, ${fkey('Variable', true)}, value DOUBLE Not Null, base DOUBLE, time_update INTEGER Not Null, ${fkey('User', true, 'update')}, ip_user TEXT Not Null, attribute TEXT);\
    CREATE TABLE tblTarget (id INTEGER PRIMARY KEY, ${fkey('Variable', true)}, value DOUBLE Not Null, time_target INTEGER Not Null, time_update INTEGER Not Null, ${fkey('User', true, 'update')}, ip_user TEXT Not Null, attribute TEXT);\
    CREATE TABLE tblMessage (id INTEGER PRIMARY KEY, textmessage TEXT Not Null, time_message INTEGER Not Null, ip_sender TEXT Not Null, ${fkey('User', true, 'sender')}, ${fkey('User', true, 'reciever')}, ${fkey('Variable', false)}, time_read INTEGER, attribute TEXT);\
    CREATE VIEW tblvVariableDef AS SELECT tblVariableDef.*, tblReportClassVariable.reportclass_id, tblReportClassVariable.variablecat_3_id, tblReportClassVariable.variabledef_id, tblUser.account as user_provider_account, tblVariableCat_3.caption as variablecat_3_caption
    , tblVariableCat_1.weight as weight_1, tblVariableCat_2.weight as weight_2, tblReportClassVariable.weight*tblVariableCat_3.weight*tblVariableCat_2.weight*tblVariableCat_1.weight as weight
    FROM tblVariableDef LEFT OUTER JOIN tblReportClassVariable ON tblVariableDef.id = tblReportClassVariable.variabledef_id LEFT OUTER JOIN tblVariableCat_3 ON tblReportClassVariable.variablecat_3_id = tblVariableCat_3.id LEFT OUTER JOIN tblUser ON tblVariableDef.user_provider=tblUser.id
    LEFT OUTER JOIN tblVariableCat_2 ON tblVariableCat_2.id = tblVariableCat_3.variablecat_2_id  LEFT OUTER JOIN tblVariableCat_1 ON tblVariableCat_1.id = tblVariableCat_2.variablecat_1_id;`;
