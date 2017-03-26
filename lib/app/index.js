const express = require('express');
const app = express();
const path = require('path');
app.set('view engine', 'pug');
app.use(express.static('static'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: true}));
app.use(require('connect-flash')());
app.use(require('serve-favicon')(path.join('static', 'favicons', 'favicon.ico')));

module.exports = app;
