const express = require('express');
const router = express.Router();
const select = require('../models-sqlite3/sql/select');
const deleteAll = require('../models-sqlite3/sql/delete');
const db = require('../models-sqlite3').getdb;
//const insert = require('../models-sqlite3/sql/insert');
const validateSelect = require('../models-sqlite3/validate').select.validate;
const validateDelete = require('../models-sqlite3/validate').delete.validate;
router.get(['/restful/:_tbl/:_where/:_value', '/restful/:_tbl/:_value', '/restful/:_tbl'], function (req, res) {
    if (req.params._tbl === 'Log') {
        if (req.params._value !== undefined) {
            //console.log(req.params);
            validateSelect({_tbl: 'tblUser', _where: 'id', id: req.params._value}).then((data) => {
                select[data._verb](db(), data).then((result)=>{
                    require('../logger').queryUserLog({account: result.account}).then((logdata)=>{res.json({data: logdata});}).catch((err) => res.status(400).send(err));
                }).catch((err)=>res.status(400).send(err));
            }).catch( (err) => {
                res.status(400).send(err);
            });
        } else {
            require('../logger').queryUserLog({account: req.user.account}).then((logdata)=>{res.json({data: logdata});}).catch((err) => res.status(400).send(err));
        }
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
router.delete(['/restful/:_tbl/:_where/:_value', '/restful/:_tbl/:_value', '/restful/:_tbl'], function (req, res, next) {
  if ((req.params._where === undefined) && (req.params._value !== undefined)) {
    req.params._where = "id";
  }
  if (req.params._value !== undefined) {
    req.params[req.params._where] = req.params._value;
  }
  req.params._tbl = "tbl" + req.params._tbl;
  validateDelete(req.params).then((data) => {
      deleteAll[data._verb](db(), data).then((result)=>{
          //TODO log
          //you can only send text
          res.status(200).send(result.changes.toString());
      }).catch((err)=>res.status(400).send(err));
  }).catch( (err) => {
      res.status(400).send(err);
  });
});
/*
  router.post('/restful/:_tbl', function (req, res, next) {
    next("TODO");
  });
  router.put('/restful/:_tbl', function (req, res, next) {
    next("TODO");
  });
*/
module.exports = router;
