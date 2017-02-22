exports.findOne = function (userdata, callback) {
  let err = false;
  //let masterpassword = 'master';
  let user = {validPassword : (password) => (password === 'master')};
  callback(err, user);
};
exports.findOrCreate = function (userdata, callback) {
  callback(null, {username : 'test'});
};
