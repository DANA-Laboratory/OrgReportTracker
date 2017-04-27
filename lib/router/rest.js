const express = require('express');
const router = express.Router();
const insert = require('../models-sqlite3/sql/insert');
const select = require('../models-sqlite3/sql/select');
const db = require('../models-sqlite3').getdb;
const validateSelect = require('../models-sqlite3/validate').select.validate;
// respose to all insert request to add a new row and logs time, ip, account of user
router.post('/insert', function (req, res, next) {
    insert[req.body.data._verb](db(), req.body.data).then(function(resData){
        require('../logger').info('insert %s record_id=%s by account=%s from remote ip=%s', req.body.data._verb, resData, req.body.data._user.account, req.body.data._ip);
        return res.send({id: resData});
    }).catch((err)=>next(err));
});
router.get('/restapi/:_verb/:_where/:_value', function (req, res, next) {
    req.params[req.params._where] = req.params._value;
    validateSelect(req.params).then((data) => {
        select[data._verb](db(), data).then((result) => res.json(result)).catch(err=>next(err));
    }).catch((err)=>next(err));
});
router.get('/restapi/:_verb/:_value', function (req, res, next) {
    validateSelect(req.params).then((data) => {
        select[data._verb](db(), data).then((result) => res.json(result)).catch(err=>next(err));
    }).catch((err)=>next(err));
});
router.get('/restapi/:_verb', function (req, res, next) {
    validateSelect(req.params).then((data) => {
        select[data._verb](db(), data).then((result) => res.json(result)).catch(err=>next(err));
    }).catch((err)=>next(err));
});
router.post('/data/report', function (req, res) {
    var reportdata = [
        {
            "PI": "عملکرد واحد",
            "PI real": "125",
            "Unit": "تن",
            "Lower Limit": 100,
            "Upper Limit": 150,
            "Edit Time": "",
            "PI target": 120,
            "PI weight": 1,
            "PI category": "مالی",
            "link": 1,
        },
        {
            "PI": "بهره وری",
            "PI real": "8.5",
            "Unit": "بی بعد",
            "Lower Limit": 0,
            "Upper Limit": 10,
            "Edit Time": "",
            "PI target": 9,
            "PI weight": 1,
            "PI category": "مالی",
            "link": 1,
        },
        {
            "PI": "نسبت سود",
            "PI real": "8001.2",
            "Unit": "میلیون ریال",
            "Lower Limit": 1000,
            "Upper Limit": 10000,
            "Edit Time": "",
            "PI target": 9000,
            "PI weight": 1,
            "PI category": "مالی",
            "link": 1,
        }
    ];
    return res.json(reportdata);
});
module.exports = router;
