'use strict';
var fs = require('fs');
var config = require('config');
var assert = require('assert');
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
      var modelsSqlite3 = require('../lib/models-sqlite3');
      modelsSqlite3.createDB().then(() => done()).catch((err)=>console.log(err));
    });
  });
});
