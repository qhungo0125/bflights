const router = require('express').Router();
const { createDebug } = require('../untils/DebugHelper');
const debug = new createDebug('/terms');
const termsController = require('../controllers/termsController');

router.get('/', termsController.getTerms);

router.post('/init', termsController.initTerms);

router.post('/change', termsController.updateTerm);

module.exports = router;
