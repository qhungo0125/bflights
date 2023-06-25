const ticketController = require('../controllers/ticketController');
const { verifyCustomerRole } = require('../controllers/userController');
const pagination = require('../untils/Pagination');

const router = require('express').Router();

router.get('/', verifyCustomerRole, pagination, ticketController.get)


router.post('/', verifyCustomerRole, ticketController.post)
router.delete('/:ticketId', verifyCustomerRole,
    ticketController.verifyTicketOwner,
    ticketController.delete)

module.exports = router;
