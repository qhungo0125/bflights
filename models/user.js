const User = function (user) {
  this.email = user.email;
  this.phone = user.phone;
  this.fullname = user.fullname;
  this.password = user.password;
  this.refreshToken = user.refreshToken;
  return this;
};
module.exports = { User };
