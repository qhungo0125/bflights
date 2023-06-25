const flightController = require('../controllers/flightController');
const { verifyAdminRole } = require('../controllers/userController');
const pagination = require('../untils/Pagination');

const router = require('express').Router();

router.get('/', pagination, flightController.getAll)
router.get('/:flightId', flightController.getFlight)
router.get('/:fromAirport/:toAirport/:dateTime', pagination, flightController.search)

router.post('/', verifyAdminRole, flightController.post)

router.put('/:flightId', verifyAdminRole, flightController.put)

router.delete('/:flightId', verifyAdminRole, flightController.delete)


module.exports = router;
