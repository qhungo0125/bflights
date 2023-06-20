const { MongoServerError } = require('mongodb');
const { Airport, airportModel } = require('../models/airport.M');

class AirportController {
    checkId = async (id) => {
        if (await airportModel.getById(id)) return true;
        else return false;
    }
    all = async (req, res) => {
        try {
            const airports = await airportModel.getAll();
            res.status(200).json(airports);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    get = async (req, res) => {
        try {
            const {
                airportId
            } = req.params;
            const airport = await airportModel.getById(airportId);
            if (airport) {
                res.status(200).json(airport);
            } else {
                throw new Error("Airport's id not existed");
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    post = async (req, res) => {
        try {
            const airportName = req.body.name;
            const newAirport = new Airport(null, airportName);
            const result = await airportModel.addNew(newAirport);
            res.status(200).json(await airportModel.getById(result.insertedId));
        } catch (error) {
            if (error instanceof MongoServerError && [11000, 11001].includes(error.code)) {
                const violatedField = Object.keys(error.keyPattern)[0];
                error.message = `Airport's ${violatedField} must be unique`;
            }
            res.status(500).json({ error: error.message });
        }
    }
    put = async (req, res) => {
        try {
            const { airportId } = req.params;
            const { name } = req.body;
            const airportObj = new Airport(airportId, name);
            await this.checkId(airportId)
            const result = await airportModel.updateById(airportObj);

            res.status(200).json(result.value);
        } catch (error) {
            if (error instanceof MongoServerError && [11000, 11001].includes(error.code)) {
                const violatedField = Object.keys(error.keyPattern)[0];
                error.message = `Airport's ${violatedField} must be unique`;
            }
            res.status(500).json({ error: error.message });
        }
    }
    delete = async (req, res) => {
        try {
            const { airportId } = req.params;
            await this.checkId(airportId)
            const result = await airportModel.deleteById(airportId);
            if (result.matchedCount === 0) throw new Error(`Airport not found`);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = new AirportController;
