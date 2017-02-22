exports.findone = function findone(userdata, callback) {
  let err = false;
  let masterpassword = 'master';
  let user = {validPassword : (password) => (password === masterpassword)};
  callback(err, user);
};
