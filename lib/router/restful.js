const express = require('express');
const router = express.Router();
const select = require('../models-sqlite3/sql/select');
const deleteAll = require('../models-sqlite3/sql/delete');
const update = require('../models-sqlite3/sql/update');
const db = require('../models-sqlite3').getdb;
//const insert = require('../models-sqlite3/sql/insert');
const validateSelect = require('../models-sqlite3/validate').select.validate;
const validateDelete = require('../models-sqlite3/validate').delete.validate;
var io = undefined;
router.get(['/restful/:_tbl/:_where/:_value', '/restful/:_tbl/:_value', '/restful/:_tbl'], function (req, res) {
    //console.log(req.params);
    if (req.params._tbl === 'Log') {
        if (req.params._value !== undefined) {
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
                delete result.password;// dont send password anyway
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
  var urlobject =  req.params._tbl;
  req.params._tbl = "tbl" + req.params._tbl;
  validateDelete(req.params).then((data) => {
      deleteAll[data._verb](db(), data).then((result)=>{
          //you can only send text
          if (result.changes === 0) {
            //conflict
            res.status(409).send("cant delete");
          } else {
            //log a delete
            require('../logger').info('delete %s by account=%s from remote ip=%s', JSON.stringify(data), req.user.account, req.connection.remoteAddress);
            res.status(200).send({changes: result.changes});
            //tell all browsers that a delete query on a table exec
            io.sockets.emit(urlobject);
            if(['ReportClassVariable'].includes(urlobject)) {
              io.sockets.emit('vVariableDef');
            }
          }
      }).catch((err)=>{
        if (err.code === 'SQLITE_CONSTRAINT') {
          //conflict
          res.status(409).send('related record exists');
        } else {
          res.status(400).send(err);
        }
      });
  }).catch( (err) => {
      res.status(400).send(err);
  });
});
//insert
router.post('/restful/:_tbl', function (req, res, next) {
  var data = req.body;
  var urlobject =  req.params._tbl;
  data._tbl = 'tbl' + req.params._tbl;
  //log an insert
  console.log(data);
  require('../logger').info('insert %s record_id=%s by account=%s from remote ip=%s', JSON.stringify(data), req.user.account, req.connection.remoteAddress);
  next("should not be here (insert)");
});
//update
router.put('/restful/:_tbl/:_value', function (req, res, next) {
  var data = req.body;
  //log an update
  data._where = 'id';
  data._value = req.params._value;
  var urlobject =  req.params._tbl;
  data._tbl = 'tbl' + req.params._tbl;
  update.updatemultiple(db() ,data).then((result)=>{
      //you can only send text
      if (result.changes === 0) {
        //conflict
        res.status(409).send("cant update");
      } else {
        //log an update
        require('../logger').info('update %s record_id=%s by account=%s from remote ip=%s', JSON.stringify(data), req.user.account, req.connection.remoteAddress);
        res.status(200).send({changes: result.changes});
        //tell all browsers that a delete query on a table exec
        io.sockets.emit(urlobject);
        if(['ReportClassVariable'].includes(urlobject)) {
          io.sockets.emit('vVariableDef');
        }
      }
  }).catch((err)=>{
    if (err.code === 'SQLITE_CONSTRAINT') {
      //conflict
      res.status(409).send('related record exists');
    } else {
      res.status(400).send(err);
    }
  });
});
module.exports = function(io_) {
  //socketIO
  io = io_;
  return router
};
