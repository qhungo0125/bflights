const flightController = require('../controllers/flightController');

const router = require('express').Router();

router.post('/', flightController.post)
router.get('/', flightController.get)
router.get('/:fromAirport/:toAirport/:dateTime', flightController.search)

module.exports = router;
