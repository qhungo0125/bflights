const router = require('express').Router();
const airportController = require('../controllers/airportController')

router.get('/', airportController.get);
router.post('/', airportController.post)
router.put('/', airportController.put)
router.delete('/', airportController.delete)


module.exports = router;
