const express = require('express');
const router = express.Router();
const modelsSqlite3 = require('../models-sqlite3');
const insert = require('../models-sqlite3/sql/insert');
const fa = require('../langs');
router.get('/', function (req, res) {
    res.render(
        'index',
        { title: 'سامانه پردازش گزارشات مدیریت، شرکت پتروشیمی بوعلی سینا', message: 'در حال طراحی https://github.com/DANA-Laboratory/PIReporter', fa: fa});
});
router.get('/old.pug', function (req, res) {
    res.render(
        'old.pug',
        { fa: fa});
});
router.get('/panels/openreport.pug', function (req, res) {
    res.render(
        'panels/openreport.pug',
        { fa: fa});
});
router.get('/panels/pi.pug', function (req, res) {
    res.render(
        'panels/pi.pug',
        { fa: fa});
});
router.post('/insert', function (req, res) {
    modelsSqlite3.createDB().then((db) => {
        insert[req.body.verb](db, req.body.data).then(function(resData){
            return res.send({id : resData});
        });
    });
});
router.post('/data/pi', function (req, res) {
    console.log(req.body);
    return res.send({a:-1});
});
module.exports = router;