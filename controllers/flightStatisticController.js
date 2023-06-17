const { flightStatisticModel, FlightStatistic } = require("../models/flightStatistic.M")
const flightController = require("./flightController")
const ticketClassController = require("./ticketClassController")

class FlightStatisticController {
    checkExistedByFlightAndTicketClass = async (flightId, classOfTicket) => {
        try {
            const flightStatistic = await
                flightStatisticModel.getByFlightAndTicketClass(flightId, classOfTicket)
            if(flightStatistic){
                return true
            } else {
                return false
            }
        } catch (error) {
            return false
        }
    }
    checkExistedId = async (id) => {
        try {
            const res = await flightStatisticModel.getById(id)
            if (res)
                return true
            else
                return false
        } catch (error) {
            return false
        }
    }
    checkValidFlightStatisticObj = async (flightStatisticObj) => {
        // Check missing attributes
        const { flightId, classOfTicket, numberOfSeat, price } = flightStatisticObj
        if (
            !flightId ||
            !classOfTicket ||
            !classOfTicket ||
            !numberOfSeat ||
            !price) {
            throw new Error('Missing required value')
        }
        // if have _id, check
        if (flightStatisticObj._id && !await this.checkExistedId()) {
            throw new Error("FlightStatistic's id is invalid")
        }
        // check flightId
        if (!await flightController.checkExistedId(flightId)) {
            throw new Error("Flight's id is invalid ")
        }
        // check classOfTicket
        if (!await ticketClassController.checkExistedId(classOfTicket)) {
            throw new Error("Ticket Class is invalid")
        }
    }
    put = async (req, res) => {
        try {
            const { flightId, classOfTicket } = req.params
            const { numberOfSeat, price } = req.body
            const flightStatisticObj = new FlightStatistic(
                null, flightId, classOfTicket, numberOfSeat, null, price
            )
            await this.checkValidFlightStatisticObj(flightStatisticObj)
            const result = await flightStatisticModel.updateByFlightAndTicketClass(
                flightStatisticObj
            )

            if (!result.value) {
                throw new Error("Error updating flight statistic")
            }
            res.status(200).json(result.value)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message })
        }
    }
    getAllOfFlight = async (req, res) => {
        try {
            const { flightId } = req.params
            const result = await flightStatisticModel.getByFlightId(
                flightId
            )
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

module.exports = new FlightStatisticController