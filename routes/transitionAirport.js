const transitionAirportController = require('../controllers/transitionAirportController');

const router = require('express').Router();

router.post('/', transitionAirportController.post)
router.get('/:flightId',transitionAirportController.get)
router.delete('/:flightId/:airportId',transitionAirportController.deleteByFlightAndAirport)

module.exports = router;
