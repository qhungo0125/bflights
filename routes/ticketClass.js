const ticketClassController = require('../controllers/ticketClassController');

const router = require('express').Router();

router.get('/', ticketClassController.all);
router.post('/', ticketClassController.post)
router.delete('/:ticketClassId', ticketClassController.del)


module.exports = router;
