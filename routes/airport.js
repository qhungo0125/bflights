const airportController = require('../controllers/airportController');

const router = require('express').Router();

router.get('/', airportController.all);
router.get('/:airportId',airportController.get)
router.post('/', airportController.post)
router.put('/:airportId', airportController.put)
router.delete('/:airportId', airportController.delete)


module.exports = router;
