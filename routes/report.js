const reportController = require('../controllers/reportController');
const { verifyAdminRole } = require('../controllers/userController');

const router = require('express').Router();

router.get("/", verifyAdminRole, reportController.get)
router.get("/:year", verifyAdminRole, reportController.getByYear)


module.exports = router;
