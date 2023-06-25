const router = require('express').Router();
const { database } = require('../configs/mongodb');
const userController = require('../controllers/userController');
const {
    verifyAccessToken,
    verifyAdminRole,
    verifyCustomerRole
} = require('../controllers/userController');
const pagination = require('../untils/Pagination');

router.get('/', verifyAdminRole, pagination, userController.getAllUser);

router.post('/delete', verifyAdminRole, userController.deleteUser);
router.post('/userinfo', verifyAccessToken, userController.getUserData);

module.exports = router;
