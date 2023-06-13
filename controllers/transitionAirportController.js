const { ObjectId } = require("mongodb")
const { TransitionAirport, TransitionAirportModel } = require("../models/transitionAirport.M")
const airportController = require("./airportController")
const flightController = require("./flightController")

class TransitionAirportController {
    checkExistedId = async (id) => {
        try {
            const foundDoc = await TransitionAirportModel.getById(id)
            if (foundDoc) {
                return true
            } else {
                return false
            }
        } catch (error) {
            return false
        }
    }
    checkValidObj = async (transitionAirportObj) => {
        const { _id, flightId, airportId, transitionDuration, note } = transitionAirportObj
        // if there is _id, check existing _id
        if (_id && !await this.checkExistedId(_id)) {
            throw new Error("Invalid Transition Airport's id")
        }

        // check missing required values
        if (!flightId ||
            !airportId ||
            !transitionDuration ||
            !note) {
            throw new Error("Missing required value")
        }
        // check existing flight
        if (!await flightController.checkExistedId(flightId)) {
            throw new Error("Invalid Flight's id")
        }
        // check existing airport
        if (!await airportController.checkId(airportId)) {
            throw new Error("Invalid Airport's id")
        }
    }
    post = async (req, res) => {
        try {
            const { flightId, airportId, transitionDuration, note } = req.body
            const transitionAirportObj = new TransitionAirport(null, flightId, airportId, transitionDuration, note)
            await this.checkValidObj(transitionAirportObj)
            const result = await TransitionAirportModel.add(transitionAirportObj)
            const newDoc = await TransitionAirportModel.getById(result.insertedId)
            res.status(200).json(newDoc)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    get = async (req, res) => {
        try {
            const { flightId } = req.params
            if (!await flightController.checkExistedId(flightId)) {
                throw new Error("Invalid Flight's id")
            }
            const transitionAirports = await TransitionAirportModel.getAllOfFlight(flightId)
            res.status(200).json(transitionAirports)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    deleteByFlightAndAirport = async (req, res) => {
        try {
            const { flightId, airportId } = req.params
            let searchParams = [flightId, airportId]
            searchParams = searchParams.map((param) => {
                try {
                    return new ObjectId(param)
                } catch (error) {
                    throw new Error("Invalid id")
                }
            })
            const deleteRes = await TransitionAirportModel.deleteByFlightAndAirport(
                ...searchParams
            )
            if (deleteRes.deletedCount === 0) {
                throw new Error("Transition Airport not found")
            }
            res.status(200).send()
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

module.exports = new TransitionAirportController