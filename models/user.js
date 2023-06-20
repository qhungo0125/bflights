const { ObjectId } = require('mongodb');
const { database } = require('../configs/mongodb');
const databaseUser = database.collection('users');
const { createDebug } = require('../untils/DebugHelper');
const debug = new createDebug('/models/user');

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

const userMethod = {
    getUsers: async () => {
        const resp = await databaseUser.find({}).toArray();
        debug('resp ', resp);
        return resp;
    },
    findUserByCondition: async (cond) => {
        const resp = await databaseUser.findOne({
            [cond.name]: cond.value
        });
        return resp;
    },
    addUser: async (user) => {
        const currentUser = new User(user);
        const resp = await databaseUser.insertOne(currentUser);
        return resp;
    },

    updateUser: async (email, refreshToken) => {
        const update = await databaseUser.findOneAndUpdate(
            { email },
            {
                $set: { refreshToken }
            }
        );

        return update;
    },
    deleteUser: async ({ _id, status = 'invalid' }) => {
        const update = await databaseUser.findOneAndUpdate(
            { _id: new ObjectId(_id) },
            {
                $set: { status }
            }
        );
        return update;
    }
};

module.exports = { User, userMethod };
