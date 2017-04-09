const router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const TelegramStrategy = require('passport-telegram').Strategy;
const config = require('config');
const logger = require('../logger');
var db = require('../models-sqlite3').getdb;
const select = require('../models-sqlite3/sql/select.js');
const fa = require('../../static/js/langs');
function findOne(username, callback) {
    select.selectAll(db(), {_tbl: "tblUser", _where: "account", account: username}).then((user) => {
        if(user !== undefined){
            user.validPassword = (pass) => {
                return require('bcrypt-nodejs').compareSync(pass, user.password);
            };
            callback(null, user);
        } else {
            callback(null, null);
        }
    }).catch((err) => {
        callback(err);
    });
}
function findOrCreateGitHub(userdata, callback) {
    if (userdata.github !== undefined) {
        select.selectAll(db(), {_tbl:"tblUser", _where: "github", github: userdata.github}).then((user) => {
            if(user !== undefined){
                logger.info('github login successful account=%s', user.account);
                callback(null, user);
            } else {
                callback(null, null);
            }
        }).catch((err) => {
            logger.info('github login fail github=%s, err=%s', userdata.github, err.toString());
            callback(err);
        });
    } else {
        callback('userdata.github undefined');
    }
}
function findOrCreateTelegram(userdata, callback) {
    if (userdata.telegram !== undefined) {
        select.selectAll(db(), {_tbl:"tblUser", _where: "telegram", telegram: userdata.telegram}).then((user) => {
            if(user !== undefined){
                logger.info('telegram login successful account=%s', user.account);
                callback(null, user);
            } else {
                callback(null, null);
            }
        }).catch((err) => {
            logger.info('telegram login fail telegram=%s, err=%s', userdata.telegram ,err.toString());
            callback(err);
        });
    } else {
        callback('userdata.telegram undefined');
    }
}
passport.use(new LocalStrategy(
    function(username, password, done) {
        findOne(username, function (err, user) {
            if (err) {
                logger.info('local login fail account=%s, err=%s',username, err.toString());
                return done(err);
            }
            if (!user) {
                logger.info('local login fail username Undefined');
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                logger.info('local login fail account=%s, err=%s', username, 'incorrect password');
                return done(null, false, { message: 'Incorrect password.' });
            }
            logger.info('local login successful account=%s', user.account);
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
        logger.info('GitHub login attempt username=%s', profile.username);
        findOrCreateGitHub({ github: profile.username }, function (err, user) {
            return cb(err, user);
        });
    }
));
passport.use(new TelegramStrategy({
            clientID: config.get("APP_ID"),
            clientSecret: config.get("APP_SECRET"),
            callbackURL: 'http://127.0.0.1:3000/auth/telegram/callback'
        },
        function(accessToken, refreshToken, profile, done) {
            logger.info('Telegram login attempt id=%s', profile.id);
            findOrCreateTelegram({ telegram: profile.id }, function (err, user) {
                done(err, user);
            });
        }
    ));
passport.serializeUser(function(user, cb) {
    cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});
router.get('/telegram',
    passport.authenticate('telegram'));
router.get('/telegram/callback',
    passport.authenticate('telegram', { failureRedirect: '/auth/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    }
);
router.get('/github',
    passport.authenticate('github'));
router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });
router.post('/login', passport.authenticate('local', {session : config.get('session'), successRedirect: '/', failureRedirect: '/auth/login', failureFlash: true, successFlash: 'Welcome!'}));
router.get('/logout', function(req, res){
  logger.info('logging out account=%s', req.user.account);
  req.logout();
  res.redirect('/');
});
router.get('/login', function (req, res) {
    res.render('auth/login.pug',
    { fa: fa, flash: req.flash('error')});
});
exports.router = router;
exports.initialize = () => passport.initialize();
exports.session = () => passport.session();
