const express = require('express');
const cors = require('cors');

// enviromental vars
const dotenv = require('dotenv');
dotenv.config();

const route = require('./routes');
const { run } = require('./configs/mongodb.js');

//connected to mongodb
run();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/auth', route.auth);
app.use('/', route.user);
app.use('/terms', route.terms);

// app.use("/auth", authen)

app.listen(port, () => {
  console.log('server is running at ', port);
});
