'use strict';

//var PIReporter = require('../lib/PIReporter.js');
var config = require('config');
var assert = require('assert');
describe('DataBase', function() {
  describe('Configuration', function() {
    it('should exists: dbPath', function() {
      assert(config.get('dbPath'));
    });
  });
});
