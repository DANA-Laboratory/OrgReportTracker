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

require('./logger').info('start');

var beforeValidateInsert = function (req, res, next) {
    req.body.data.ip = req.connection.remoteAddress;
    req.body.data._verb = req.body.verb;
    validate.validateInsert(req.body.data).then(() => next()).catch((err)=>next('validateInsert failed with:' + err));
};

app.use(permission.initialize());
app.use(permission.session());
app.use('/insert', beforeValidateInsert);
app.use('/auth', permission.router);
app.use(require('./router'));
 app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

module.exports = app;
