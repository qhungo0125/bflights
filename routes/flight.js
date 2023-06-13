const flightController = require('../controllers/flightController');

const router = require('express').Router();

router.post('/', flightController.post)
router.get('/', flightController.get)
router.get('/:fromAirport/:toAirport/:dateTime', flightController.search)
router.put('/:flightId', flightController.put)
router.delete('/:flightId', flightController.delete)


module.exports = router;
