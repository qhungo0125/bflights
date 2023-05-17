const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const route = require('./routes');
const { MongoClient, ServerApiVersion } = require('mongodb');

dotenv.config();
//connect to mongodb

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
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/', route.user);

// app.use("/auth", authen)

app.listen(port, () => {
  console.log('server is running at ', port);
});
