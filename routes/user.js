const router = require('express').Router();
const { database } = require('../configs/mongodb');
const userController = require('../controllers/userController');
const {
    verifyAccessToken,
    verifyAdminRole,
    verifyCustomerRole
} = require('../controllers/userController');
const { ticketClassMethod } = require('../models/ticketClass');

router.get('/', verifyAdminRole, userController.getAllUser);
router.delete('/', verifyAdminRole, userController.deleteUser);
router.post('/userinfo', verifyAccessToken, userController.getUserData);

module.exports = router;
