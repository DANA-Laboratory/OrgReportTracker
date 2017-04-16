/*
 * PIReporter
 * https://github.com/DANA-Laboratory/PIReporter
 *
 * Copyright (c) 2017 Reza Afzalan
 * Licensed under the MIT license.
 */

const app = require('./app');
const validate = require('./models-sqlite3/validate');
const permission = require('./permission');
const routers = require('./router');

require('./logger').info('start');
require('./models-sqlite3').opendb().then(require('./logger').info('db opened'));
//add any data before validating rest requests
var validateInsert = function (req, res, next) {
    req.body.data._ip = req.connection.remoteAddress;
    req.body.data._verb = req.body.verb;
    req.body.data._user = {id: req.user.id, account: req.user.account};
    validate.insert.validate(req.body.data).then(()=>next()).catch((err)=>next(err));
};
var validateUpdate = function (req, res, next) {
    req.body.data._ip = req.connection.remoteAddress;
    req.body.data._verb = req.body.verb;
    req.body.data._user = {id: req.user.id, account: req.user.account};
    validate.update.validate(req.body.data).then(() => next()).catch((err)=>next(err));
};
app.use(permission.initialize());
app.use(permission.session());
app.use('/auth', permission.router);
app.use(function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() || req.url==='/auth/login') {
      return next();
  }
  res.redirect('/auth/login');
});
app.use('/insert', validateInsert);
app.use('/update', validateUpdate);
for (var key in routers) {
  app.use(routers[key]);
}
 app.listen(3000, function () {
    console.log('PIRReporter app listening on port 3000!');
});

module.exports = app;
