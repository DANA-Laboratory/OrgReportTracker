/*
 * PIReporter
 * https://github.com/DANA-Laboratory/PIReporter
 *
 * Copyright (c) 2017 Reza Afzalan
 * Licensed under the MIT license.
 */

const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const validate = require('./models-sqlite3/validate');
const insert = require('./models-sqlite3/sql/insert');
const modelsSqlite3 = require('../lib/models-sqlite3');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const permission = require('./permission');
const session = require('express-session');
const flash = require('connect-flash');
const config = require('config');

passport.use(new LocalStrategy(
  function(username, password, done) {
    permission.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
passport.use(new GitHubStrategy({
    clientID: config.get("GITHUB_CLIENT_ID"),
    clientSecret: config.get("GITHUB_CLIENT_SECRET"),
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    permission.findOrCreate({ githubId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
passport.use(new GoogleStrategy({
    clientID:     config.get("GOOGLE_CLIENT_ID"),
    clientSecret: config.get("GOOGLE_CLIENT_SECRET"),
    callbackURL: "http://127.0.0.1:3000/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    permission.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.set('view engine', 'pug');

router.get('/auth/github',
  passport.authenticate('github'));
router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
router.get('/auth/google',
  passport.authenticate('google', { scope:
  	[ 'https://www.googleapis.com/auth/plus.login',
  	  'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
));
router.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));

router.post('/login', passport.authenticate('local', {session : config.get('session'), successRedirect: '/', failureRedirect: '/login', failureFlash: true, successFlash: 'Welcome!'}));
router.get('/', function (req, res) {
  res.render(
    'index',
    { title: 'سامانه پردازش گزارشات مدیریت، شرکت پتروشیمی بولعی سینا', message: 'در حال طراحی https://github.com/DANA-Laboratory/PIReporter'});
});

var beforeValidateInsert = function (req, res, next) {
  req.body.data.ip = req.connection.remoteAddress;
  validate.validateInsert(req.body.verb, req.body.data).then(() => next());
};

router.post('/insert', function (req, res) {
  modelsSqlite3.createDB().then((db) => {
    insert[req.body.verb](db, req.body.data).then(function(resData){
      return res.send({id : resData});
    });
  });
});
app.use(bodyParser.json());
app.use(express.static('static'));
app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use('/insert', beforeValidateInsert);
app.use(router);

app.listen(3000, function () {
 console.log('Example app listening on port 3000!');
});

module.exports = app;
