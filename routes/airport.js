const airportController = require('../controllers/airportController');
const { verifyAdminRole } = require('../controllers/userController');

const router = require('express').Router();

router.get('/', airportController.all);
router.get('/:airportId',airportController.get)
router.post('/',verifyAdminRole, airportController.post)
router.put('/:airportId',verifyAdminRole, airportController.put)
router.delete('/:airportId',verifyAdminRole, airportController.delete)


module.exports = router;
