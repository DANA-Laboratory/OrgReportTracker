/*
 * PIReporter
 * https://github.com/DANA-Laboratory/PIReporter
 *
 * Copyright (c) 2017 Reza Afzalan
 * Licensed under the MIT license.
 */

var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

app.set('view engine', 'pug');

router.get('/', function (req, res) {
  res.render(
    'index',
    { title: 'سامانه پردازش گزارشات مدیریت، شرکت پتروشیمی بولعی سینا', message: 'در حال طراحی https://github.com/DANA-Laboratory/PIReporter'});
});

var beforeinsert = function (req, res, next) {
  req.data = {ip : req.connection.remoteAddress};
  require('./models-sqlite3/sql/validate').validateForInsert(req.body.verb, req.data).then( function(/*resData*/) {
    next();
  });
};

router.post('/insert', function (req, res) {
  return res.send(req.data);
});
app.use(bodyParser.json());
app.use('/insert', beforeinsert);
app.use(express.static('static'));
app.use(router);

app.listen(3000, function () {
 console.log('Example app listening on port 3000!');
});

module.exports = app;
