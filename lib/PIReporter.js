/*
 * PIReporter
 * https://github.com/DANA-Laboratory/PIReporter
 *
 * Copyright (c) 2017 Reza Afzalan
 * Licensed under the MIT license.
 */

const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const validate = require('./models-sqlite3/validate');
const insert = require('./models-sqlite3/sql/insert');
const modelsSqlite3 = require('../lib/models-sqlite3');

app.set('view engine', 'pug');

router.get('/', function (req, res) {
  res.render(
    'index',
    { title: 'سامانه پردازش گزارشات مدیریت، شرکت پتروشیمی بولعی سینا', message: 'در حال طراحی https://github.com/DANA-Laboratory/PIReporter'});
});

var beforeValidateInsert = function (req, res, next) {
  req.body.data.ip = req.connection.remoteAddress;
  validate.validateInsert(req.body.verb, req.body.data).then(() => next());
};

router.post('/insert', function (req, res) {
  modelsSqlite3.createDB().then((db) => {
    insert[req.body.verb](db, req.body.data).then(function(resData){
      return res.send({id : resData});
    });
  });
});

app.use(bodyParser.json());
app.use('/insert', beforeValidateInsert);
app.use(express.static('static'));
app.use(router);

app.listen(3000, function () {
 console.log('Example app listening on port 3000!');
});

module.exports = app;
