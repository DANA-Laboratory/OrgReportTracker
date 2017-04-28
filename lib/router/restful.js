const express = require('express');
const router = express.Router();
const select = require('../models-sqlite3/sql/select');
const db = require('../models-sqlite3').getdb;
//const insert = require('../models-sqlite3/sql/insert');
const validateSelect = require('../models-sqlite3/validate').select.validate;
router.get(['/restful/:_tbl/:_where/:_value', '/restful/:_tbl/:_value', '/restful/:_tbl'], function (req, res) {
    if (req.params._tbl === 'Log') {
        require('../logger').queryUserLog({account: req.user.account}).then((logdata)=>{res.json({data: logdata});}).catch((err) => res.status(400).send(err));
    } else {
        if ((req.params._where === undefined) && (req.params._value !== undefined)) {
          req.params._where = "id";
        }
        if (req.params._value !== undefined) {
          req.params[req.params._where] = req.params._value;
        }
        req.params._tbl = "tbl" + req.params._tbl;
        validateSelect(req.params).then((data) => {
            select[data._verb](db(), data).then((result)=>{
                res.json(result);
            }).catch((err)=>res.status(400).send(err));
        }).catch( (err) => {
            res.status(400).send(err);
        });
    }
});
/*
  router.post('/restful/:_tbl', function (req, res, next) {
    next("TODO");
  });
  router.put('/restful/:_tbl', function (req, res, next) {
    next("TODO");
  });
  router.delete(['/restful/:_tbl/:_where/:_value', '/restful/:_tbl/:_value', '/restful/:_tbl'], function (req, res, next) {
    next("TODO");
  });
*/
module.exports = router;
