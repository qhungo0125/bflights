const router = require('express').Router();
const { createDebug } = require('../untils/DebugHelper');
const debug = new createDebug('/terms');
const termsController = require('../controllers/termsController');
const { verifyAdminRole } = require('../controllers/userController');

router.get('/', verifyAdminRole, termsController.getTerms);

router.post('/init', verifyAdminRole, termsController.initTerms);

router.post('/change', verifyAdminRole, termsController.updateTerm);

module.exports = router;
