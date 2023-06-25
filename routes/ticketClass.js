const ticketClassController = require('../controllers/ticketClassController');
const { verifyAdminRole } = require('../controllers/userController');

const router = require('express').Router();

router.get('/', ticketClassController.all);
router.post('/', verifyAdminRole, ticketClassController.post)
router.delete('/:ticketClassId', verifyAdminRole, ticketClassController.del)


module.exports = router;
