'use strict';
const fs = require('fs');
const config = require('config');
const assert = require('assert');
const modelsSqlite3 = require('../lib/models-sqlite3');
const app = require('../');
const supertest = require('supertest')(app);

describe('DataBase', function() {
  describe('Configuration', function() {
    it('should exists: dbPath', function(done) {
      assert(config.get('dbPath'));
      done();
    });
  });
  describe('Db Create', function() {
    before(function () {
        if (fs.existsSync(config.get('dbPath'))) {
            fs.unlinkSync(config.get('dbPath'));
        }
    });
    it('should create database', function(done) {
      modelsSqlite3.createDB(modelsSqlite3.ddl).then(() => done()).catch((err)=>console.log(err));
    });
  });
});
describe('Api test', function() {
  it('get home', function(done) {
      supertest
          .get('/')
          .expect(200)
          .end(done);
  });
  it('redirect to login when wrong', function(done) {
    let data = {username : 'rafzalan', password : 'wrong'};
    supertest
      .post('/login')
      .type('json')
      .send(data)
      .expect(302)
      .expect('Location', '/login')
      .end(done);
  });
  it('redirect to / after login', function(done) {
    let data = {username : 'rafzalan', password : 'master'};
    supertest
      .post('/login')
      .type('json')
      .send(data)
      .expect(302)
      .expect('Location', '/')
      .end(done);
  });
  it('possible login with github', function(done) {
    supertest
      .get('/auth/github')
      .expect(302)
      .end(done);
  });
  it('addUser', function(done) {
      let data  = '{"verb":"addUser", "data":{"workunit":"un1", "sysadmin":true, "pcode":"555555", "account":"rafzalan", "password":"vafa01", "fname":"رضا", "lname":"افضلان"}}';
      supertest
          .post('/insert')
          .type('json')
          .send(data)
          .expect('{"id":1}')
          .expect(200)
          .end(done);
  });
});
