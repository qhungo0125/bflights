const router = require('express').Router();
const { createDebug } = require('../untils/DebugHelper');
const debug = new createDebug('/auth');
const userController = require('../controllers/userController');

router.post('/register', userController.handleRegister);
router.post('/login', userController.handleLogin);
router.get('/refresh', userController.refreshTokenAgain);
router.post('/logout', userController.handleLogout);
module.exports = router;
