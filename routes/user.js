const router = require('express').Router();
const { database } = require('../configs/mongodb');
const {
    verifyAccessToken,
    verifyAdminRole,
    verifyCustomerRole,
    getUserData,
    getAllUser,
    deleteUser
} = require('../controllers/userController');
const { ticketClassMethod } = require('../models/ticketClass');

router.get('/', verifyAdminRole, getAllUser);
router.delete('/', verifyAdminRole, deleteUser);

router.get('/test', verifyAccessToken, async (req, res) => {
    try {
        // await ticketClassMethod.init();
        const resp = await ticketClassMethod.getAll();
        res.status(200).json(resp);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
