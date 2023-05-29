const router = require('express').Router();
const { createDebug } = require('../untils/DebugHelper');
const debug = new createDebug('/auth/register');
const userController = require('../controllers/userController');
// register user
// input: email, phone (global), full name, password
// ouput: success/ fail

router.post('/register', userController.handleRegister);
router.post('/login', userController.handleLogin);
router.get('/refresh', userController.refreshTokenAgain);
router.get('/logout', userController.handleLogout);
module.exports = router;
