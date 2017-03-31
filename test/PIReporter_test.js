const fs = require('fs');
const config = require('config');
const assert = require('assert');
const modelsSqlite3 = require('../lib/models-sqlite3');
const importer = require('../lib/models-sqlite3/importCSV');
const sqldelete = require('../lib/models-sqlite3/sql/delete');
const sqlselect= require('../lib/models-sqlite3/sql/select');
const app = require('../');
const validator = require('../lib/models-sqlite3/validate.js');
const supertest = require('supertest')(app);
var db = null;

describe('DataBase', function() {
    before(function (done) {
        this.timeout(9500);
        assert(config.get('dbPath'));
        if (fs.existsSync(config.get('dbPath'))) {
            modelsSqlite3.closedb().then(() => {
                fs.unlinkSync(config.get('dbPath'));
                modelsSqlite3.createDB(modelsSqlite3.ddl).then((db_) => {
                    assert(db_);
                    db = db_;
                    done();
                }).catch((err)=>console.log(err));
            });
        } else {
            modelsSqlite3.createDB(modelsSqlite3.ddl).then((db_) => {
                assert(db_);
                db = db_;
                done();
            }).catch((err)=>console.log(err));
        }
    });
    after(function (done) {
        this.timeout(9500);
        importer.importFromCSV(db, __dirname + '/csv/users.csv', (csvData) => validator.fvalidateInsert('addUser', csvData)).then(() => done()).catch((err) => console.log(err));
    });
    describe('should import data from csv', function() {
        it('should import users data', function(done) {
            assert(db);
            this.timeout(9500);
            importer.importFromCSV(db, __dirname + '/csv/users.csv', (csvData) => validator.fvalidateInsert('addUser', csvData)).then(() => done()).catch((err) => console.log(err));
        });
        it('should import report class data', function(done) {
            importer.importFromCSV(db, __dirname + '/csv/reportclass.csv', (csvData) => validator.fvalidateInsert('addReportClass', csvData)).then(() => done()).catch((err) => console.log(err));
        });
        it('should import pitype_1', function(done) {
            importer.importFromCSV(db, __dirname + '/csv/pitype_1.csv', (csvData) => validator.fvalidateInsert('addPIType_1', csvData)).then(() => done()).catch((err) => console.log(err));
        });
        it('should import pitype_2', function(done) {
            importer.importFromCSV(db, __dirname + '/csv/pitype_2.csv', (csvData) => validator.fvalidateInsert('addPIType_2', csvData)).then(() => done()).catch((err) => console.log(err));
        });
        it('should import pitype_2', function(done) {
            importer.importFromCSV(db, __dirname + '/csv/pitype_3.csv', (csvData) => validator.fvalidateInsert('addPIType_3', csvData)).then(() => done()).catch((err) => console.log(err));
        });
        it('should import variable definitions', function(done) {
            importer.importFromCSV(db, __dirname + '/csv/variables.csv', (csvData) => validator.fvalidateInsert('addVariableDef', csvData)).then(() => done()).catch((err) => console.log(err));
        });
        it('should add variables to report', function(done) {
            importer.importFromCSV(db, __dirname + '/csv/variables.csv', (csvData) => {
                csvData.reportclass_id = 'BSC';
                csvData.variabledef_id = csvData.caption;
                return validator.fvalidateInsert('addReportVariable', csvData);
            }).then(() => done()).catch((err) => console.log(err));
        });
    });
    describe('should select', function() {
        it('should select users', function(done) {
            let data = {_verb : 'selectUser'};
            validator.validateSelect(data).then((data)=>sqlselect[data._verb](db, data)).then((data)=>{
                assert(data.length===8);
                done();
            });
        });
        it('should select reportclasses', function(done) {
            let data = {_verb : 'selectReportClass'};
            validator.validateSelect(data).then((data)=>sqlselect[data._verb](db, data)).then((data)=>{
                assert(data[0].duration==='3M');
                done();
            });
        });
    });
    describe('should delete data', function() {
        it('should not delete all users data', function(done) {
            let data = {_verb : 'deleteAllUsers'};
            validator.validateDelete(data).then((data) => {
                sqldelete.deleteAll(db, data).catch(() => done());
            });
        });
        it('should remove variables from report', function(done){
            let data = {_verb : 'removeAllVariables'};
            validator.validateDelete(data).then((data) => {
                sqldelete.deleteAll(db, data).catch(() => done());
            });
        });
        it('should delete variables', function(done){
            let data = {_verb : 'deleteAllVariables'};
            validator.validateDelete(data).then((data) => {
                sqldelete.deleteAll(db, data).catch(() => done());
            });
        });
        it('should delete all report classes', function(done) {
            let data = {_verb : 'deleteAllReportClasses'};
            validator.validateDelete(data).then((data) => {
                sqldelete.deleteAll(db, data).catch(() => done());
            });
        });
        it('should delete all users data', function(done) {
            let data = {_verb : 'deleteAllUsers'};
            validator.validateDelete(data).then((data) => {
                sqldelete.deleteAll(db, data).catch(() => done());
            });
        });
    });
});
describe('Api test', function() {
    it('redirect to login when user undefined', function(done) {
        let data = {username : 'undefined', password : 'wrong'};
        supertest
            .post('/auth/login')
            .type('form')
            .send(data)
            .expect(302)
            .expect('Location', '/auth/login')
            .end(done);
    });
    it('redirect to login when pass is wrong', function(done) {
        let data = {username : 'rafzalan', password : 'wrong'};
        supertest
            .post('/auth/login')
            .type('form')
            .send(data)
            .expect(302)
            .expect('Location', '/auth/login')
            .end(function() {
                done();
            });
    });
    var agent = require('supertest').agent(app);
    it('redirect to / after login', function(done) {
        let data = {username : 'rafzalan', password : 'arg707'};
        agent
            .post('/auth/login')
            .type('form')
            .send(data)
            .expect(302)
            .expect('Location', '/')
            .end(function(err) {
                if (err) {
                  return done(err);
                }
                done();
            });
    });
    it('get home after login', function(done) {
        this.timeout(3500);
        agent
            .get('/')
            .expect(200)
            .end(function(err) {
                if (err) {
                  return done(err);
                }
                done();
            });
    });
    it('redirect when login with github', function(done) {
        supertest
            .get('/auth/github')
            .expect(302)
            .end(done);
    });
    it('redirect to right place with github', function(done) {
        supertest
            .get('/auth/github')
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                if(res.header.location === 'https://github.com/login/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fauth%2Fgithub%2Fcallback&client_id=9ba540c3b4a08daf656d'){
                    console.info('direct to the right place');
                } else {
                    console.info('mal direction, do you github login?');
                }
                done();
            });
    });
    it('login with github', function(done) {
        this.timeout(50000);
        setTimeout(function() {
            console.info('timeout exceeded, login fail, do you github login?');
            done();
        }, 49000);
        supertest
            .get('/auth/github')
            .redirects(2)
            .end(function(err, res) {
                if (err) {
                    console.info('login fail, check internet connection.');
                    done();
                }
                if(res.status === 200) {
                    console.info('could login');
                } else {
                    console.info('login fail, do you github login?');
                }
                done();
            });
    });
    it('display logs', function(done) {
        supertest
            .get('/logs')
            .expect(200)
            .end(done);
    });
    it('redirect when login with telegram', function(done) {
        supertest
            .get('/auth/telegram')
            .expect(302)
            .end(done);
    });
    it('addUser', function(done) {
        let data  = '{"verb":"addUser", "data":{"workunit":"un1", "sysadmin":true, "pcode":"555555", "account":"rafzalan2", "password":"vafa01", "fname":"رضا", "lname":"افضلان", "github":"", "telegram":""}}';
        agent
            .post('/insert')
            .type('json')
            .send(data)
            .expect(200)
            .end(done);
    });
});
