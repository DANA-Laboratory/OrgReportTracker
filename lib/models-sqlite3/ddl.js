exports.ddl = '\
    CREATE TABLE tblReportClass (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, caption TEXT Not Null, duration TEXT, owner INTEGER REFERENCE tblReportClass (id), reviewer INTEGER REFERENCE tblReportClass (id));\
    CREATE TABLE tblReport (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, class INTEGER Not Null REFERENCE tblReportClass (id), caption TEXT Not Null, owner INTEGER REFERENCE tblReportClass (id), reviewer INTEGER REFERENCE tblReportClass (id), timelimit INTEGER Not Null);\
    CREATE TABLE tblPIClass (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, class INTEGER REFERENCE Not Null tblReportClass (id), unit TEXT Not Null);\
    CREATE TABLE tblPI(id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, value DOUBLE Not Null, updatetime INTEGER Not Null, updateuser INTEGER Not Null REFERENCES tblUser (id));\
    CREATE TABLE tblPIType_1 (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, caption TEXT Not Null);\
    CREATE TABLE tblPIType_2 (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, caption TEXT Not Null, type REFERENCE tblPIType_1 (id));\
    CREATE TABLE tblPIType_3 (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, caption TEXT Not Null, type REFERENCE tblPIType_2 (id));\
    CREATE TABLE tblUser (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, fname TEXT Not Null, lname TEXT Not Null, pcode TEXT Not Null, unit TEXT Not Null, tel TEXT);\
    CREATE TABLE tblMessage (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, value TEXT Not Null, time INTEGER Not Null, ip TEXT Not Null, sender INTEGER Not Null REFERENCES tblUser (id), reciever INTEGER Not Null REFERENCES tblUser (id), pi INTEGER REFERENCES tblPI (id), read BOOLEAN Not Null);';
