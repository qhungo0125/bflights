const { createDebug } = require('../untils/DebugHelper');
const debug = new createDebug('/controllers/termsController');
const { termsMethod } = require('../models/terms');
const { TransitionAirportModel } = require('../models/transitionAirport.M');

class TermsController {
  constructor() {
    this.getTermsData()
  }
  getTermsData = async () => {
    this.terms = await termsMethod.getTerms()
  }
  getTerms = async (req, res) => {
    try {
      const resp = await termsMethod.getTerms();
      res.status(200).json(resp);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  initTerms = async (req, res) => {
    try {
      const resp = await termsMethod.getTermsArray();
      // debug(resp);
      if (resp.length !== 0)
        return res.status(200).json('terms is initialized');
    } catch (error) {
      debug(error);
      return res.status(500).json(error);
    }

    debug('next');

    const terms = {
      quantityAirports: 10,
      minTimeFlight: 0, // in minutes
      maxTransitions: 10,
      minPauseTime: 0,
      maxPauseTime: 10, // in minutes
      quantityClasses: 3
    };

    debug(terms);

    try {
      const resp = await termsMethod.insertTerms(terms);
      return res.status(200).json(resp.acknowledged);
    } catch (error) {
      debug(error);
      return res.status(500).json(error);
    }
  }
  updateTerm = async (req, res) => {
    const { name, value } = req.body;
    debug(name, value);
    const terms = [
      'quantityAirports',
      'minTimeFlight',
      'maxTransitions',
      'minPauseTime',
      'maxPauseTime',
      'quantityClasses'
    ];

    if (name.length == 0 || !terms.includes(name)) {
      return res.status(500).json({ error: 'invalid term' });
    }

    if (!Number.isInteger(value)) {
      return res.status(500).json({ error: 'Value must be in Integer' });
    }

    try {
      debug('update start');
      const update = await termsMethod.updateTerm({ name, value });
      debug('update end ', update.value);

      if (!update.value) {
        return res.status(500).json({ error: 'Fail to update terms' });
      }
      this.getTermsData()
      return res.status(200).json('update success');
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  checkValidFlightDuration = async (flightDuration) => {
    if (flightDuration < this.terms.minTimeFlight) {
      throw new Error(`Flight Duration must be greater than ${this.terms.minTimeFlight}`)
    }
  }

  checkInsertionAbility = async (flightId) => {
    const transitionAirports = await TransitionAirportModel.getAllOfFlight(flightId)
    if (transitionAirports.length >= this.terms.maxTransitions) {
      throw new Error("Maximum Transition Airports Reached")
    }
  }

  checkValidTranstionDuration = async (transitionDuration) => {
    if (transitionDuration < this.terms.minPauseTime ||
      transitionDuration > this.terms.maxPauseTime) {
      throw new Error(`Transition Duration must be in [${this.terms.minPauseTime},
         ${this.terms.maxPauseTime}]`)
    }
  }
};

module.exports = new TermsController;
