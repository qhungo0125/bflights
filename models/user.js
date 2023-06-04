const User = function (user) {
  this.email = user.email;
  this.phone = user.phone;
  this.fullname = user.fullname;
  this.password = user.password;
  this.refreshToken = user.refreshToken;
  this.role = user.role;
  this.identificationCode = user.identificationCode;
  this.status = user.status;
  // 2 roles: admin, customer
  return this;
};
module.exports = { User };
