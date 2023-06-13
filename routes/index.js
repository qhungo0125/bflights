const user = require('./user');
const auth = require('./auth');
const terms = require('./terms');
const airport = require('./airport')
const flight = require('./flight')
const flightStatistic = require('./flightStatistic')
const ticket = require('./ticket')
const transitionAirport = require('./transitionAirport')
module.exports = {
  user,
  auth,
  terms,
  airport,
  flight,
  flightStatistic,
  ticket,
  transitionAirport
};
