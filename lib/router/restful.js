const express = require('express');
const router = express.Router();
const select = require('../models-sqlite3/sql/select');
const db = require('../models-sqlite3').getdb;
//const insert = require('../models-sqlite3/sql/insert');
//const validateSelect = require('../models-sqlite3/validate').validateSelect;
router.get(['/restful/:_tbl/:_where/:_value', '/restful/:_tbl/:_value', '/restful/:_tbl'], function (req, res, next) {
  select.selectAll(db(), req.params).then((result)=>res.json(result)).catch((err)=>next(err));
});
router.post('/restful/:_tbl', function (req, res, next) {
  next("TODO");
});
router.put('/restful/:_tbl', function (req, res, next) {
  next("TODO");
});
router.delete(['/restful/:_tbl/:_where/:_value', '/restful/:_tbl/:_value', '/restful/:_tbl'], function (req, res, next) {
  next("TODO");
});
module.exports = router;
