const { flightStatisticModel } = require("../models/flightStatistic.M");
const { Ticket, TicketModel } = require("../models/ticket.M");
const { userMethod } = require("../models/user");
const flightController = require("./flightController");
const flightStatisticController = require("./flightStatisticController");
const ticketClassController = require("./ticketClassController")
class TicketController {
    checkValidTicket = async (ticketObj) => {
        const { flightId, classOfTicket } = ticketObj
        if (!flightId ||
            !classOfTicket)
            throw new Error("Missing required infomation")

        if (!await
            flightStatisticController.checkExistedByFlightAndTicketClass(flightId, classOfTicket)) {
            throw new Error("Flight Statistic is not existed")
        }
    }
    post = async (req, res) => {
        try {
            const { flightId, classOfTicket } = req.body

            const user = await userMethod.findUserByCondition(
                {
                    name: 'email',
                    value: req.user.email
                }
            )
            const newTicket = new Ticket(flightId, classOfTicket, user._id)
            await this.checkValidTicket(newTicket)

            const decreaseEmptySeatResult =
                await flightStatisticModel.decreaseEmptySeat(flightId, classOfTicket)
            if (decreaseEmptySeatResult.modifiedCount === 0) {
                throw new Error("No empty seat allow")
            }
            const result = await TicketModel.add(newTicket)
            res.status(200).json(await TicketModel.getById(result.insertedId))
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    get = async (req, res) => {
        try {
            const user = await userMethod.findUserByCondition(
                {
                    name: "email",
                    value: req.user.email
                }
            )
            const tickets = await TicketModel.getAllTicket(user._id)
            res.status(200).json(tickets)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

module.exports = new TicketController