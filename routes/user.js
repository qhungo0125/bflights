const router = require('express').Router();
const { database } = require('../configs/mongodb');
const {
  verifyAccessToken,
  verifyAdminRole,
  verifySaleRole,
  verifyCustomerRole
} = require('../controllers/userController');

router.get('/sale', verifySaleRole, (req, res) => {
  res.status(200).json('sale success');
});

router.get('/customer', verifyCustomerRole, (req, res) => {
  res.status(200).json('customer success');
});

router.get('/test', (req, res) => {
  // Replace the uri string with your MongoDB deployment's connection string.
  async function run() {
    try {
      const movies = database.collection('collection1');
      const findResult = await movies.find({}).toArray();
      res.status(200).json(findResult);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  run();
});

router.get('/', verifyAdminRole, (req, res) => {
  // Replace the uri string with your MongoDB deployment's connection string.
  async function run() {
    try {
      const movies = database.collection('collection1');
      const findResult = await movies.find({}).toArray();
      res.status(200).json(findResult);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  run();
});

module.exports = router;
