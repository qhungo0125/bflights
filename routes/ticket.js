const ticketController = require('../controllers/ticketController');
const { verifyAccessToken } = require('../controllers/userController');
const pagination = require('../untils/Pagination');

const router = require('express').Router();

router.get('/', verifyAccessToken, pagination, ticketController.get)


router.post('/', verifyAccessToken, ticketController.post)
router.delete('/:ticketId', verifyAccessToken,
    ticketController.verifyTicketOwner,
    ticketController.delete)

module.exports = router;
