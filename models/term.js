const Term = function (term) {
  this.quantityAirports = term.quantityAirports;
  this.minTimeFlight = term.minTimeFlight;
  this.maxTransitions = term.maxTransitions;
  this.minPauseTime = term.minPauseTime;
  this.maxPauseTime = term.maxPauseTime;
  this.quantityClasses = term.quantityClasses;
  return this;
};
module.exports = { Term };
