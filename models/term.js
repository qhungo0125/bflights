const { database } = require('../configs/mongodb');
const databaseTerm = database.collection('terms');

const Term = function (term) {
  this.quantityAirports = term.quantityAirports;
  this.minTimeFlight = term.minTimeFlight;
  this.maxTransitions = term.maxTransitions;
  this.minPauseTime = term.minPauseTime;
  this.maxPauseTime = term.maxPauseTime;
  this.quantityClasses = term.quantityClasses;
  return this;
};

const termsMethod = {
  getTerms: async () => {
    const resp = await databaseTerm.findOne({});
    return resp;
  },

  getTermsArray: async () => {
    const resp = await databaseTerm.find({}).toArray();
    return resp;
  },
  insertTerms: async (terms) => {
    const resp = await databaseTerm.insertOne(terms);
    return resp;
  },
  updateTerm: async ({ name, value }) => {
    const update = await databaseTerm.findOneAndUpdate(
      {},
      {
        $set: { [name]: value }
      }
    );
    return update;
  }
};

module.exports = { Term, termsMethod };
