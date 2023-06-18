const ticketController = require('../controllers/ticketController');
const { verifyAccessToken } = require('../controllers/userController');

const router = require('express').Router();

router.post('/', verifyAccessToken, ticketController.post)
router.get('/', verifyAccessToken, ticketController.get)
router.delete('/:ticketId', verifyAccessToken,
ticketController.verifyTicketOwner, 
ticketController.delete)

module.exports = router;
