const { createDebug } = require('../untils/DebugHelper');
const debug = new createDebug('/controllers/userController');
const validator = require('validator');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const { database } = require('../configs/mongodb');
const databaseUser = database.collection('users');
const { gRefreshToken, gAccessToken } = require('../untils/Token');
let loginedUsers = [];

const userController = {
  handleRegister: async (req, res) => {
    const { email, phone, fullname, password } = req.body;
    debug(req.body);
    if (!email || !phone || !fullname || !password) {
      return res.status(500).json({ error: 'Missing required value' });
    }

    debug('validated email');
    if (!validator.isEmail(email)) {
      return res.status(500).json({ error: 'Invalid email' });
    }

    debug('validated mobile phone');
    if (!validator.isMobilePhone(phone)) {
      return res.status(500).json({ error: 'Invalid mobile phone' });
    }

    const regexValidateFullName = /^[a-zA-Z ]+$/;
    debug(regexValidateFullName.test(fullname));
    if (!regexValidateFullName.test(fullname)) {
      return res.status(500).json({ error: 'Invalid full name' });
    }

    debug(password.length);
    if (password.length < 8) {
      return res
        .status(500)
        .json({ error: 'Password must be at least 8 characters' });
    }

    // save info to database

    // find user in db

    try {
      debug('here');
      const oldUser = await databaseUser.findOne({
        email
      });
      // .toArray();
      debug(oldUser);
      if (oldUser) {
        return res.status(500).json({ error: 'Existed user' });
      }
    } catch (error) {
      return res.status(500).json(error);
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);
    const refreshToken = gRefreshToken({ email });
    const currentUser = new User({
      email,
      password: hashPassword,
      fullname,
      phone,
      refreshToken
    });

    debug(currentUser);

    try {
      await databaseUser.insertOne(currentUser);
    } catch (error) {
      debug(error);
      return res.status(500).json(error);
    }

    const { _id, password: pw, ...data } = currentUser;
    return res.status(200).json(data);
  },
  handleLogin: async (req, res) => {
    const { email, password } = req.body;
    debug(req.body);
    if (!email || !password) {
      return res.status(200).json({ error: 'Invalid data' });
    }

    let oldUser = await databaseUser.findOne({ email });
    if (!oldUser) {
      return res.status(500).json({ error: 'Invalid account' });
    }

    const cmpPassword = await bcrypt.compare(password, oldUser.password);
    if (!cmpPassword) {
      return res.status(500).json({ error: 'Wrong password' });
    }

    const refreshToken = gRefreshToken(oldUser);

    try {
      debug('update start');
      const update = await databaseUser.findOneAndUpdate(
        { email: oldUser.email },
        {
          $set: { refreshToken }
        }
      );
      debug('update end ', update.value);

      if (!update.value) {
        return res.status(500).json({ error: 'Fail to update user data' });
      }
      oldUser.refreshToken = refreshToken;
      const { _id, password: pw, ...data } = oldUser;
      data.accessToken = gAccessToken(data);
      loginedUsers.push(data.accessToken);
      debug('pre: ', loginedUsers);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  handleLogout: async (req, res) => {
    debug('pre logout: ', loginedUsers);
    loginedUsers = loginedUsers.filter((tkItem) => tkItem != req.headers.token);
    debug('after logout: ', loginedUsers);
    return res.status(200).json({});
  },
  verifyAccessToken: async (req, res, next) => {
    const { token } = req.headers;
    debug(token);
    if (!token) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    jwt.verify(token, process.env.jwtAccessToken, async (err, payload) => {
      if (err) {
        debug('pre verify: ', loginedUsers);
        if (loginedUsers.includes(token)) {
          loginedUsers = loginedUsers.filter((tkItem) => tkItem != token);
        }
        debug('after verify: ', loginedUsers);
        return res.status(403).json({ error: err });
      }
      let oldUser = await databaseUser.findOne({ email: payload.email });
      if (!oldUser) {
        return res.status(500).json({ error: 'Invalid account' });
      }
      req.user = { email: oldUser.email };
      debug(loginedUsers);
      return next();
    });
  },
  refreshTokenAgain: async (req, res) => {
    const { refreshtoken, token } = req.headers;
    debug(refreshtoken);
    if (!refreshtoken || !token) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    jwt.verify(
      refreshtoken,
      process.env.jwtRefreshToken,
      async (err, payload) => {
        if (err) {
          return res.status(403).json({ error: err });
        }
        let oldUser = await databaseUser.findOne({
          refreshToken: refreshtoken
        });
        if (!oldUser) {
          return res.status(500).json({ error: 'Invalid account' });
        }

        // xoa token dang ton tai
        loginedUsers = loginedUsers.filter((user) => user !== token);

        // generate newToken
        const newAccessToken = gAccessToken(oldUser);
        loginedUsers.push(newAccessToken);
        res.status(200).json({ accessToken: newAccessToken });
      }
    );
  }
};

module.exports = userController;