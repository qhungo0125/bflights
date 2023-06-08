
const { Airport, airportModel } = require('../models/airport.M');


const airportController = {
    checkId: async (id) => {
        if (await airportModel.getById(id))
            return true
        else
            return false
    },
    get: async (req, res) => {
        try {
            const airports = await airportModel.getAll()
            res.status(200).json(airports)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    post: async (req, res) => {
        try {
            const airportName = req.body.name
            const newAirport = new Airport(airportName)
            const result = await airportModel.addNew(newAirport)
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    put: async (req, res) => {
        try {
            const { id, newName } = req.body
            const result = await airportModel.updateById(id, "name", newName)
            if (result.matchedCount === 0)
                throw new Error(`Airport not found`)
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    delete: async (req, res) => {
        try {
            const { airportId } = req.body
            const result = await airportModel.deleteById(airportId)
            if (result.matchedCount === 0)
                throw new Error(`Airport not found`)
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

module.exports = airportController