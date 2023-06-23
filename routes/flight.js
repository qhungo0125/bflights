const flightController = require('../controllers/flightController');
const pagination = require('../untils/Pagination');

const router = require('express').Router();

router.get('/', pagination, flightController.getAll)
router.get('/:flightId', flightController.getFlight)
router.get('/:fromAirport/:toAirport/:dateTime', flightController.search)

router.post('/', flightController.post)

router.put('/:flightId', flightController.put)

router.delete('/:flightId', flightController.delete)


module.exports = router;
