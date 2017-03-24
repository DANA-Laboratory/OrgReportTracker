const router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const TelegramStrategy = require('passport-telegram').Strategy;
const config = require('config');
const logger = require('../logger');
var db = require('../models-sqlite3').getdb;
const select = require('../models-sqlite3/sql/select.js')
function findOne(userdata, callback) {
    select.selectAll(db(), {_tbl: "tblUser", where: "account", account: userdata.username}).then((res) => {
        user.validPassword = (pass) => {
            return require('bcrypt-nodejs').compareSync(pass, res.password);
        };
    }).catch((err) => {
        logger.info('local login fail', {userdata: userdata, err: err});
        callback(err, null);
    });

    }
    callback(err, user);
}
function findOrCreate(userdata, callback) {
    if (userdata.github !== undefined) {
        select.idfordata(db(), {_tbl:"tblUser", _where: "github", github: userdata.github}).then((res) => {
            logger.info('github login successful', userdata);
            callback(null, {username : 'guest'});
        }).catch((err) => {
            logger.info('github login fail', {userdata: userdata, err: err});
            callback(err, null);
        });
    } else {

    }
}
passport.use(new LocalStrategy(
    function(username, password, done) {
        findOne({ username: username }, function (err, user) {
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
        findOrCreate({ github: profile.username }, function (err, user) {
            return cb(err, user);
        });
    }
));
passport.use(
    new TelegramStrategy({
            clientID: config.get("APP_ID"),
            clientSecret: config.get("APP_SECRET"),
            callbackURL: 'http://127.0.0.1:3000/auth/telegram/callback'
        },
        function(accessToken, refreshToken, profile, done) {
            findOrCreate(profile, function (err, user) {
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
exports.router = router;
exports.initialize = () => passport.initialize();
exports.session = () => passport.session();
