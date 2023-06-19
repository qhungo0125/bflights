const ticketClassController = require('../controllers/ticketClassController');

const router = require('express').Router();

router.get('/', ticketClassController.all);


module.exports = router;
