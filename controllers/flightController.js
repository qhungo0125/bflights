
const { ObjectId } = require('mongodb')
const { Flight, flightModel } = require('../models/flight.M')
const airportController = require('./airportController')

class flightController {
    checkExistedId = async (id) => {
        try {
            const res = await flightModel.getById(id)
            if (res)
                return true
            else
                return false
        } catch (error) {
            return false
        }
    }
    checkValidFlightObj = async (flight) => {
        // Check missing attributes
        if (!flight.dateTime ||
            !flight.flightDuration ||
            !flight.fromAirport ||
            !flight.toAirport) {
            throw new Error('Missing required value')
        }

        // Check validation of attributes
        if (flight._id && !(await this.checkExistedId(flight._id))) {
            throw new Error("Flight's is is not existed")
        }

        if (isNaN(flight.dateTime)) {
            throw new Error("Invalid date-time")
        }

        if (!await airportController.checkId(flight.fromAirport)
            || !await airportController.checkId(flight.toAirport)) {
            throw new Error("Airport not exist")
        }
    }
    post = async (req, res) => {
        try {
            const {
                dateTime, flightDuration, fromAirport, toAirport,
            } = req.body
            // Check valid flight obj
            const newFlightObj = new Flight(
                null, dateTime, flightDuration,
                fromAirport, toAirport)
            await this.checkValidFlightObj(newFlightObj)

            // insert into database
            const insertNewFlightResult = await flightModel.add(newFlightObj)
            res.status(200).json(
                await flightModel.getById(
                    insertNewFlightResult.insertedId
                )
            )
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    get = async (req, res) => {
        try {
            const flights = await flightModel.all()
            res.status(200).json(flights)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    search = async (req, res) => {
        try {
            const { fromAirport,
                toAirport,
                dateTime
            } = req.params 

            let parameters = [fromAirport,
                toAirport,
                dateTime]
            parameters = parameters.map((parameter) => {
                try {
                    return parameter === "undefined" ? undefined : new ObjectId(parameter)
                } catch (error) {
                    throw new Error("Invalid Id")
                }
            })
            const searchResults = await flightModel.getSearchResult(
                ...parameters
            )
            res.status(200).json(searchResults)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message })
        }
    }
    put = async (req, res) => {
        try {
            const { flightId } = req.params
            const {
                dateTime, flightDuration, fromAirport, toAirport
            } = req.body
            const flightObj = new Flight(flightId, dateTime, flightDuration, fromAirport, toAirport)
            await this.checkValidFlightObj(flightObj)
            const result = await flightModel.updateById(flightObj)
            res.status(200).json(result.value)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    delete = async (req, res) => {
        try {
            const { flightId } = req.params
            if (!await this.checkExistedId(flightId)) {
                throw new Error("Flight's id not existed")
            }
            const result = await flightModel.deleteById(flightId)
            res.status(200).send("Delete Flight successful")
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

module.exports = new flightController