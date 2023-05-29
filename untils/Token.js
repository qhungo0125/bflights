const { createDebug } = require('./DebugHelper');
const debug = new createDebug('/utils/token');
const jwt = require('jsonwebtoken');

const generateToken = {
  gRefreshToken: ({ email }) => {
    return jwt.sign(
      {
        email
      },
      process.env.jwtRefreshToken,
      {
        expiresIn: process.env.timeRefresh
      }
    );
  },
  gAccessToken: ({ email, fullname, phone }) => {
    return jwt.sign(
      {
        email,
        fullname,
        phone
      },
      process.env.jwtAccessToken,
      {
        expiresIn: process.env.timeAccess
      }
    );
  }
};

module.exports = generateToken;
