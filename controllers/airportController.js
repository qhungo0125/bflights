
const { Airport, airportModel } = require('../models/airport.M');


const airportController = {
    checkId: async (id) => {
        if (await airportModel.getById(id))
            return true
        else
            return false
    },
    all: async (req, res) => {
        try {
            const airports = await airportModel.getAll()
            res.status(200).json(airports)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    get: async (req, res) => {
        try {
            const { airportId } = req.params
            const airport = await airportModel.getById(airportId)
            if (airport) {
                throw new Error("Airport's id not existed")
            }
            res.status(200).json(airport)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    post: async (req, res) => {
        try {
            const airportName = req.body.name
            const newAirport = new Airport(null, airportName)
            const result = await airportModel.addNew(newAirport)
            res.status(200).json(
                await airportModel.getById(result.insertedId)
            )
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    put: async (req, res) => {
        try {
            const { airportId } = req.params
            const { name } = req.body
            const airportObj = new Airport(airportId, name)
            const result = await airportModel.updateById(airportObj)

            res.status(200).json(result.value)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    delete: async (req, res) => {
        try {
            const { airportId } = req.params
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