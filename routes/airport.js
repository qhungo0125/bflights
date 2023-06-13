const router = require('express').Router();
const airportController = require('../controllers/airportController')

router.get('/', airportController.all);
router.get('/:airportId',airportController.get)
router.post('/', airportController.post)
router.put('/:airportId', airportController.put)
router.delete('/:airportId', airportController.delete)


module.exports = router;
