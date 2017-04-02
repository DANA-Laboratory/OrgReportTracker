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
    req.body.data.ip = req.connection.remoteAddress;
    req.body.data._verb = req.body.verb;
    validate.validateInsert(req.body.data).then(() => next()).catch((err)=>next(err));
};
var validateUpdate = function (req, res, next) {
    req.body.data.ip = req.connection.remoteAddress;
    req.body.data._verb = req.body.verb;
    validate.validateUpdate(req.body.data).then(() => next()).catch((err)=>next(err));
};
var validateSelect = function (req, res, next) {
    //any get request to restapi will route to a select statement
    if (req.method === 'GET') {
        //add anything to req.params here
        validate.validateSelect(req.params).then(() => next()).catch((err)=>next(err));
    } else {
        next();
    }
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
app.use('/restapi', validateSelect);
for (var key in routers) {
  app.use(routers[key]);
}
 app.listen(3000, function () {
    console.log('PIRReporter app listening on port 3000!');
});

module.exports = app;
