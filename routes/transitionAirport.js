const transitionAirportController = require('../controllers/transitionAirportController');
const { verifyAdminRole } = require('../controllers/userController');

const router = require('express').Router();

router.post('/', verifyAdminRole, transitionAirportController.post)
router.get('/:flightId', transitionAirportController.get)
router.delete('/:flightId/:airportId', verifyAdminRole, transitionAirportController.deleteByFlightAndAirport)

module.exports = router;
