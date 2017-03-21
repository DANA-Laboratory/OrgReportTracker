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
        if (fs.existsSync(config.get('dbPath'))) {
            fs.unlinkSync(config.get('dbPath'));
        }
        assert(config.get('dbPath'));
        modelsSqlite3.createDB(modelsSqlite3.ddl).then((db_) => {
            assert(db_);
            db = db_;
            done();
        }).catch((err)=>console.log(err));
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
    describe('should remove users data', function() {
        it('should not remove all users data', function(done) {
            let data = {_verb : 'deleteAllUsers'};
            validator.validateDelete(data).then((data) => {
                sqldelete.deleteAllUsers(db, data).catch(() => done());
            });
        });
        it('should remove all report classes', function(done) {
            let data = {_verb : 'deleteAllReportClasses'};
            validator.validateDelete(data).then((data) => {
                sqldelete.deleteAllUsers(db, data).then(() => done());
            });
        });
        it('should remove all users data', function(done) {
            let data = {_verb : 'deleteAllUsers'};
            validator.validateDelete(data).then((data) => {
                sqldelete.deleteAllUsers(db, data).then(() => done());
            });
        });
    });
});
describe('Api test', function() {
    it('get home', function(done) {
        this.timeout(3500);
        supertest
            .get('/')
            .expect(200)
            .end(done);
    });
    it('redirect to login when wrong', function(done) {
        let data = {username : 'rafzalan', password : 'wrong'};
        supertest
            .post('/auth/login')
            .type('json')
            .send(data)
            .expect(302)
            .expect('Location', '/auth/login')
            .end(done);
    });
    it('redirect to / after login', function(done) {
        let data = {username : 'rafzalan', password : 'master'};
        supertest
            .post('/auth/login')
            .type('json')
            .send(data)
            .expect(302)
            .expect('Location', '/')
            .end(done);
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
        supertest
            .get('/auth/github')
            .redirects(2)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                if(res.status === 200){
                    console.info('could login');
                } else {
                    console.info('login fail, do you github login?');
                }
                done();
            });
    });
    it('redirect when login with telegram', function(done) {
        supertest
            .get('/auth/telegram')
            .expect(302)
            .end(done);
    });
    it('addUser', function(done) {
        let data  = '{"verb":"addUser", "data":{"workunit":"un1", "sysadmin":true, "pcode":"555555", "account":"rafzalan2", "password":"vafa01", "fname":"رضا", "lname":"افضلان"}}';
        supertest
            .post('/insert')
            .type('json')
            .send(data)
            .expect(200)
            .end(done);
    });
});
