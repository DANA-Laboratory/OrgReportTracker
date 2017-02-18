'use strict';

//var PIReporter = require('../lib/PIReporter.js');
var config = require('config');
var assert = require('assert');
//var modelsSqlite3 = require('../lib/models-sqlite3');
describe('DataBase', function() {
  describe('Configuration', function() {
    it('should exists: dbPath', function() {
      assert(config.get('dbPath'));
    });
  });
});
