const express = require('express');
const cors = require('cors');

// enviromental vars
const dotenv = require('dotenv');
dotenv.config();

const route = require('./routes');
const { run } = require('./configs/mongodb.js');
const router = require('./routes/flight');

//connected to mongodb
run();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/auth', route.auth);
app.use('/user', route.user);
app.use('/terms', route.terms);
app.use('/airport', route.airport);
app.use('/flight', route.flight);
app.use('/flightStatistic', route.flightStatistic);
app.use('/ticket', route.ticket);
app.use('/transition-airport', route.transitionAirport);
app.use('/report', route.report);
app.use('/ticket-class', route.ticketClass);

// app.use("/auth", authen)

app.listen(port, () => {
    console.log('server is running at ', port);
});
