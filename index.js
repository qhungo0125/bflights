const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const route = require('./routes');

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/', route.user);

// app.use("/auth", authen)

app.listen(port, () => {
  console.log('server is running at ', port);
});
