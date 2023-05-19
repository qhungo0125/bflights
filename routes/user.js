const router = require('express').Router();
const { MongoClient } = require('mongodb');
const { client } = require('../config/mongodb');

router.get('/', (req, res) => {
  // Replace the uri string with your MongoDB deployment's connection string.
  async function run() {
    try {
      const database = client.db('BflightsDB');
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
