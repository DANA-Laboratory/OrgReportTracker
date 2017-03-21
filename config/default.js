var secrets = {
    "GITHUB_CLIENT_ID": 'random',
    "GITHUB_CLIENT_SECRET": 'random',
    "APP_ID" : 'random',
    "APP_SECRET" : 'random'
};
if (require('fs').existsSync(`${__dirname}/secret.secret`)) {
    secrets = require('./secret.secret');
}
module.exports = {
    "couldCreateAdmin": false,
    "session": true,
    "GITHUB_CLIENT_ID": secrets.GITHUB_CLIENT_ID,
    "GITHUB_CLIENT_SECRET": secrets.GITHUB_CLIENT_SECRET,
    "APP_ID" : secrets.APP_ID,
    "APP_SECRET" : secrets.APP_SECRET
};
