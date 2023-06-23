const flightController = require('../controllers/flightController');

const router = require('express').Router();

router.get('/', flightController.get)
router.get('/:flightId',flightController.getFlight)
router.get('/:fromAirport/:toAirport/:dateTime', flightController.search)

router.post('/', flightController.post)

router.put('/:flightId', flightController.put)

router.delete('/:flightId', flightController.delete)


module.exports = router;
