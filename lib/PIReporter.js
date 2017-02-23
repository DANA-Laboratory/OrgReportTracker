/*
 * PIReporter
 * https://github.com/DANA-Laboratory/PIReporter
 *
 * Copyright (c) 2017 Reza Afzalan
 * Licensed under the MIT license.
 */

const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const validate = require('./models-sqlite3/validate');
const insert = require('./models-sqlite3/sql/insert');
const modelsSqlite3 = require('../lib/models-sqlite3');
const permission = require('./permission');
const session = require('express-session');
const flash = require('connect-flash');
const favicon = require('serve-favicon');
const path = require('path');

app.set('view engine', 'pug');

var beforeValidateInsert = function (req, res, next) {
  req.body.data.ip = req.connection.remoteAddress;
  validate.validateInsert(req.body.verb, req.body.data).then(() => next());
};
router.get('/', function (req, res) {
  res.render(
    'index',
    { title: 'سامانه پردازش گزارشات مدیریت، شرکت پتروشیمی بوعلی سینا', message: 'در حال طراحی https://github.com/DANA-Laboratory/PIReporter'});
});

router.post('/insert', function (req, res) {
  modelsSqlite3.createDB().then((db) => {
    insert[req.body.verb](db, req.body.data).then(function(resData){
      return res.send({id : resData});
    });
  });
});
app.use(bodyParser.json());
app.use(express.static('static'));
app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true}));
app.use(flash());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicons', 'favicon.ico')));
app.use(permission.initialize());
app.use(permission.session());
app.use('/insert', beforeValidateInsert);
app.use('/auth', permission.router);
app.use(router);

app.listen(3000, function () {
 console.log('Example app listening on port 3000!');
});

module.exports = app;
