const { createDebug } = require('../untils/DebugHelper');
const debug = new createDebug('/controller/userController');
const validator = require('validator');
const { userMethod } = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const { gRefreshToken, gAccessToken } = require('../untils/Token');
let loginedUsers = [];

const userController = {
    handleRegister: async (req, res) => {
        const { email, phone, fullname, password, role, identificationCode } =
            req.body;
        if (
            !email ||
            !phone ||
            !fullname ||
            !password ||
            !role ||
            !identificationCode
        ) {
            return res.status(500).json({ error: 'Missing required value' });
        }

        if (!validator.isEmail(email)) {
            return res.status(500).json({ error: 'Invalid email' });
        }

        if (!validator.isMobilePhone(phone)) {
            return res.status(500).json({ error: 'Invalid mobile phone' });
        }

        // const regexValidateFullName = /^[a-zA-Z ]+$/;
        // if (!regexValidateFullName.test(fullname)) {
        //   return res.status(500).json({ error: 'Invalid full name' });
        // }

        if (password.length < 8) {
            return res
                .status(500)
                .json({ error: 'Password must be at least 8 characters' });
        }

        if (identificationCode.length != 12) {
            return res
                .status(500)
                .json({ error: 'Identification Code must be 12 characters' });
        }

        if (role != 'admin' && role != 'customer') {
            return res.status(500).json({ error: 'Invalid role' });
        }

        // save info to database

        // find user in db

        try {
            const oldUser = await userMethod.findUserByCondition({
                name: 'email',
                value: email
            });
            // .toArray();
            if (oldUser) {
                return res.status(500).json({ error: 'Existed user' });
            }
        } catch (error) {
            return res.status(500).json(error);
        }

        const hashPassword = await bcrypt.hash(password, saltRounds);
        const refreshToken = gRefreshToken({ email });

        const user = {
            email,
            password: hashPassword,
            fullname,
            phone,
            refreshToken,
            role,
            identificationCode,
            status: 'valid'
        };

        try {
            await userMethod.addUser(user);
        } catch (error) {
            return res.status(500).json(error);
        }

        const { _id, password: pw, ...data } = user;
        return res.status(200).json(data);
    },
    handleLogin: async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(200).json({ error: 'Invalid data' });
        }

        let oldUser = await userMethod.findUserByCondition({
            name: 'email',
            value: email
        });
        if (!oldUser) {
            return res.status(500).json({ error: 'Invalid account' });
        }

        const cmpPassword = await bcrypt.compare(password, oldUser.password);
        if (!cmpPassword) {
            return res.status(500).json({ error: 'Wrong password' });
        }

        const refreshToken = gRefreshToken(oldUser);

        try {
            const update = await userMethod.updateUser(
                oldUser.email,
                refreshToken
            );

            if (!update.value) {
                return res
                    .status(500)
                    .json({ error: 'Fail to update user data' });
            }
            oldUser.refreshToken = refreshToken;
            const { _id, password: pw, ...data } = oldUser;
            data.accessToken = gAccessToken(data);
            loginedUsers.push(data.accessToken);
            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    handleLogout: async (req, res) => {
        if (!req.headers.token) {
            return res.status(500).json({ error: 'Invalid accessToken' });
        }
        loginedUsers = loginedUsers.filter(
            (tkItem) => tkItem != req.headers.token
        );
        return res.status(200).json({});
    },
    verifyAccessToken: async (req, res, next) => {
        const { token } = req.headers;
        if (!token) {
            return res.status(403).json({ error: 'Not allowed' });
        }

        jwt.verify(token, process.env.jwtAccessToken, async (err, payload) => {
            if (err) {
                if (loginedUsers.includes(token)) {
                    loginedUsers = loginedUsers.filter(
                        (tkItem) => tkItem != token
                    );
                }
                return res.status(403).json({ error: err });
            }

            let oldUser = await userMethod.findUserByCondition({
                name: 'email',
                value: payload.email
            });

            if (!oldUser) {
                return res.status(500).json({ error: 'Invalid account' });
            }
            req.user = { email: oldUser.email, role: oldUser.role };
            return next();
        });
    },
    refreshTokenAgain: async (req, res) => {
        const { refreshtoken, token } = req.headers;
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

                debug(refreshtoken);

                let oldUser = await userMethod.findUserByCondition({
                    name: 'refreshToken',
                    value: refreshtoken
                });

                debug('old user ', oldUser);

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
    },
    verifyAdminRole: async (req, res, next) => {
        userController.verifyAccessToken(req, res, () => {
            if (req.user.role === 'admin') {
                return next();
            }
            return res.status(401).json('Forbiden');
        });
    },
    verifyCustomerRole: async (req, res, next) => {
        userController.verifyAccessToken(req, res, () => {
            if (req.user.role === 'customer') {
                return next();
            }
            return res.status(401).json('Forbiden');
        });
    },
    getUserData: async (req, res) => {
        const { email } = req.body;
        if (!email) {
            return res.status(500).json({ error: 'Missing required value' });
        }
        try {
            const user = await userMethod.findUserByCondition({
                name: 'email',
                value: email
            });
            // .toArray();
            if (user) {
                return res.status(200).json({ data: user });
            }
        } catch (error) {
            return res.status(500).json({ error });
        }
    },
    getAllUser: async (req, res) => {
        const { page = process.env.page, perPage = process.env.perPage } =
            req.query;
        try {
            const usersdb = await userMethod.getUsers();
            debug(users);

            const users = usersdb.filter((u) => u.status !== 'invalid');

            const startIdx = (page - 1) * perPage;
            const endIdx = page * perPage;

            const usersData = users.slice(startIdx, endIdx);

            if (usersData.length == 0) {
                res.status(200).json({ users: [] });
            }

            const usersDataFilter = usersData.map((u) => {
                const { password, refreshToken, ...data } = u;
                return {
                    ...data
                };
            });
            if (usersData.length !== 0) {
                return res.status(200).json({ users: usersDataFilter });
            }
        } catch (error) {
            return res.status(500).json({ error });
        }
    },
    deleteUser: async (req, res) => {
        const { _id } = req.body;
        console.log(req.body);
        if (!_id) {
            return res.status(500).json({ error: 'Missing required value' });
        }
        try {
            const user = await userMethod.deleteUser({ _id });
            debug(user);
            if (user) {
                return res.status(200).json({ data: 'success' });
            }
        } catch (error) {
            return res.status(500).json({ error });
        }
    }
};

module.exports = userController;
