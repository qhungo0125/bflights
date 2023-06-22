
const { ObjectId } = require('mongodb')
const { Flight, flightModel } = require('../models/flight.M')
const airportController = require('./airportController')
const termsController = require('./termsController')

class flightController {
    checkExistedId = async (id) => {
        try {
            const res = await flightModel.getById(id);
            if (res) return true;
            else return false;
        } catch (error) {
            return false;
        }
    };
    checkValidFlightObj = async (flight) => {
        // Check missing attributes
        if (
            !flight.dateTime ||
            !flight.flightDuration ||
            !flight.fromAirport ||
            !flight.toAirport
        ) {
            throw new Error('Missing required value');
        }

        // Check validation of attributes
        if (flight._id && !(await this.checkExistedId(flight._id))) {
            throw new Error("Flight's is is not existed")
        }

        if (isNaN(flight.dateTime)) {
            throw new Error("Invalid date-time")
        }

        if (flight.dateTime < new Date()) {
            throw new Error("Flight datetime can not be in the past")
        }

        if (!Number.isInteger(flight.flightDuration)) {
            throw new Error("Flight Duration must be an interger")
        }
        await termsController.checkValidFlightDuration(flight.flightDuration)

        if (
            !(await airportController.checkId(flight.fromAirport)) ||
            !(await airportController.checkId(flight.toAirport))
        ) {
            throw new Error('Airport not exist');
        }
    }
    post = async (req, res) => {
        try {
            const {
                dateTime, flightDuration, fromAirport, toAirport,
            } = req.body
            // Check valid flight obj
            const newFlightObj = new Flight(
                null,
                dateTime,
                flightDuration,
                fromAirport,
                toAirport
            );
            await this.checkValidFlightObj(newFlightObj)

            // insert into database
            const insertNewFlightResult = await flightModel.add(newFlightObj);
            res.status(200).json(
                await flightModel.getById(insertNewFlightResult.insertedId)
            );
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    get = async (req, res) => {
        const { page = process.env.page, perPage = process.env.perPage } =
            req.query;
        try {
            const flights = await flightModel.all();

            const startIdx = (page - 1) * perPage;
            const endIdx = page * perPage;

            const flightsData = flights.slice(startIdx, endIdx);

            if (flightsData.length == 0) {
                return res.status(200).json([]);
            }

            return res.status(200).json(flightsData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    search = async (req, res) => {
        try {
            let { fromAirport, toAirport, dateTime } = req.params;
            try {
                fromAirport = fromAirport === 'undefined' ? undefined : new ObjectId(fromAirport);
            } catch (error) {
                throw new Error('Invalid Id');
            }

            try {
                toAirport = toAirport === 'undefined' ? undefined : new ObjectId(toAirport);
            } catch (error) {
                throw new Error('Invalid Id');
            }

            if (dateTime === 'undefined') {
                dateTime = new Date(dateTime);
                if (isNaN(dateTime)) {
                    throw new Error("Invalid date-time")
                }
            } else {
                dateTime = undefined
            }

            const searchResults = await flightModel.getSearchResult(
                fromAirport, toAirport, dateTime
            );
            res.status(200).json(searchResults);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    };
    put = async (req, res) => {
        try {
            const { flightId } = req.params;
            const { dateTime, flightDuration, fromAirport, toAirport } =
                req.body;
            const flightObj = new Flight(
                flightId,
                dateTime,
                flightDuration,
                fromAirport,
                toAirport
            );
            await this.checkValidFlightObj(flightObj);
            const result = await flightModel.updateById(flightObj);
            res.status(200).json(result.value);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    delete = async (req, res) => {
        try {
            const { flightId } = req.params;
            if (!(await this.checkExistedId(flightId))) {
                throw new Error("Flight's id not existed");
            }
            const result = await flightModel.deleteById(flightId);
            res.status(200).send('Delete Flight successful');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

module.exports = new flightController
