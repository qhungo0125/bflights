const User = function (user) {
  this.email = user.email;
  this.phone = user.phone;
  this.fullname = user.fullname;
  this.password = user.password;
  this.refreshToken = user.refreshToken;
  this.role = user.role;
  // 3 roles: admin, sale, customer
  return this;
};
module.exports = { User };
