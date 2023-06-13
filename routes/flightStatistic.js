const flightStatisticController = require('../controllers/flightStatisticController');

const router = require('express').Router();

router.put('/:flightId/:classOfTicket', flightStatisticController.put)
router.get('/:flightId',flightStatisticController.getAllOfFlight)

module.exports = router;
