const express = require('express');
const app = express();
const path = require('path');
app.set('view engine', 'pug');
app.use(express.static('static'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());
//app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: false}));

var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);

app.use(session({
  store: new SQLiteStore(),
  secret: 'lksadjlfkajsdfl;kjsda;lfkjsadl;',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
}));

app.use(require('connect-flash')());
app.use(require('serve-favicon')(path.join('static', 'favicons', 'favicon.ico')));

module.exports = app;
