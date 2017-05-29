const express = require('express');
const router = express.Router();
const fa = require('../../static/js/langs');
const restapi = require('./rest.js');
const restful = require('./restful.js');

router.get('/', function (req, res) {
    res.render(
        'index',
        { title: 'سامانه پردازش گزارشات مدیریت، شرکت پتروشیمی بوعلی سینا', message: 'در حال طراحی https://github.com/DANA-Laboratory/PIReporter', fa: fa});
});
//route all pug pages to an equal file if exists
router.get(/^\/([^\.]+)\.pug/, function (req, res) {
    var path = (req.params[0]+'.pug');
    if (require('fs').existsSync('views/'+path)) {
      res.render(
          path,
          { fa: fa});
    }
});

module.exports = function(io){
  return {
    view: router,
    restapi: restapi,
    restful: restful(io)
  }
}
