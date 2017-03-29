const express = require('express');
const router = express.Router();
const insert = require('../models-sqlite3/sql/insert');
const fa = require('../langs');
var db = require('../models-sqlite3').getdb;
router.get('/', function (req, res) {
    res.render(
        'index',
        { title: 'سامانه پردازش گزارشات مدیریت، شرکت پتروشیمی بوعلی سینا', message: 'در حال طراحی https://github.com/DANA-Laboratory/PIReporter', fa: fa});
});
router.get(/^\/([^\.]+)\.pug/, function (req, res) {
    var path = (req.params[0]+'.pug');
    if (require('fs').existsSync('views/'+path)) {
      res.render(
          path,
          { fa: fa});
    }
});
router.post('/insert', function (req, res) {
    insert[req.body.verb](db(), req.body.data).then(function(resData){
        return res.send({id : resData});
    });
});
router.post('/data/report', function (req, res) {
    reportdata = [
        {
            "PI": "عملکرد واحد",
            "PI real": "125",
            "Unit": "تن",
            "Lower Limit": 100,
            "Upper Limit": 150,
            "Edit Time": "",
            "PI target": 120,
            "PI weight": 1,
            "PI category": "مالی"
        },
        {
            "PI": "بهره وری",
            "PI real": "8.5",
            "Unit": "درصد",
            "Lower Limit": 0,
            "Upper Limit": 10,
            "Edit Time": "",
            "PI target": 9,
            "PI weight": 1,
            "PI category": "مالی"
        },
        {
            "PI": "نسبت سود",
            "PI real": "8001.2",
            "Unit": "بی بعد",
            "Lower Limit": 1000,
            "Upper Limit": 10000,
            "Edit Time": "",
            "PI target": 9000,
            "PI weight": 1,
            "PI category": "مالی"
        }
    ]
    return res.json(reportdata);
});
module.exports = router;
