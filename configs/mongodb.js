const { MongoClient, ServerApiVersion } = require('mongodb');
const { createDebug } = require('../untils/DebugHelper');
const debug = new createDebug('configs/mongodb');
const uri = process.env.mongoUri;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});
async function run() {
  debug('async function run()');
  try {
    debug('connect');
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
  } catch (err) {
    client.close();
    return err;
  }
}

const database = client.db('BflightsDB');

module.exports = {
  run,
  database
};
