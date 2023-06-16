const reportController = require('../controllers/reportController');

const router = require('express').Router();

router.get("/", reportController.get)
router.get("/:year", reportController.getByYear)


module.exports = router;
