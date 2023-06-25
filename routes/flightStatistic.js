const flightStatisticController = require('../controllers/flightStatisticController');
const { verifyAdminRole } = require('../controllers/userController');

const router = require('express').Router();

router.put('/:flightId/:classOfTicket', verifyAdminRole, flightStatisticController.put)
router.get('/:flightId',flightStatisticController.getAllOfFlight)

module.exports = router;
