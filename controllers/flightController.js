
const { ObjectId } = require('mongodb')
const { Flight, flightModel } = require('../models/flight.M')
const { ticketClassMethod } = require('../models/ticketClass')
const airportController = require('./airportController')

class flightController {
    post = async (req, res) => {
        try {
            const {
                dateTime, flightTime, numberOfEmptySeat, numberOfBookedSeat, fromAirport, toAirport,
                flightStatistics,
            } = req.body
            if (
                !dateTime ||
                !flightTime ||
                !numberOfEmptySeat ||
                !numberOfBookedSeat ||
                !fromAirport ||
                !toAirport ||
                !flightStatistics)
                throw new Error('Missing required value')
            if (!(dateTime instanceof Date))
                throw new Error("Invalid date-time")
            flightStatistics.forEach((flightStatistic) => {
                const { classOfTicket, numberOfSeat } = flightStatistic
                if (
                    !classOfTicket ||
                    !numberOfSeat)
                    throw new Error('Missing required value')
            })
            if (!await airportController.checkId(fromAirport)
                || !await airportController.checkId(toAirport))
                throw new Error("Airport not exist")


            const checkFlightStatistic = flightStatistics.reduce((acc, flightStatistic) =>
                acc.filter(ticketClass => ticketClass._id == flightStatistic.classOfTicket)
                , await ticketClassMethod.getAll()).length === 0;
            if (!checkFlightStatistic)
                throw new Error("Invalid Flight Statistics")


            const newFlight = await flightModel.add(
                new Flight(dateTime, flightTime, numberOfEmptySeat, numberOfBookedSeat, fromAirport, toAirport, flightStatistics)
            )

            res.status(200).json(req.body)
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
            
            const searchResults = await flightModel.getSearchResult(
                fromAirport !== 'undefined' ? new ObjectId(fromAirport) : undefined,
                toAirport !== 'undefined' ? new ObjectId(toAirport) : undefined,
                dateTime !== 'undefined' ? new Date(dateTime) : undefined
            )
            res.status(200).json(searchResults)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

module.exports = new flightController