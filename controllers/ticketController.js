const { flightStatisticModel } = require("../models/flightStatistic.M");
const { Ticket, TicketModel } = require("../models/ticket.M");
const { userMethod } = require("../models/user");
const flightController = require("./flightController");
const ticketClassController = require("./ticketClassController")
const ticketController = {
    post: async (req, res) => {
        try {
            const { flightId, classOfTicket } = req.body
            if (!flightId ||
                !classOfTicket)
                throw new Error("Missing required infomation")
            if (!await flightController.checkExistedId(flightId))
                throw new Error("Flight's id is invalid")
            if (!await ticketClassController.checkExistedId(classOfTicket))
                throw new Error("Class of Ticket is invalid")

            const user = await userMethod.findUserByCondition(
                {
                    name: 'email',
                    value: req.user.email
                }
            )
            const decreaseEmptySeatResult =
                await flightStatisticModel.decreaseEmptySeat(flightId, classOfTicket)
            if (decreaseEmptySeatResult.modifiedCount === 0)
                throw new Error("No empty seat allow")
            const newTicket = new Ticket(flightId, classOfTicket, user._id)
            const result = await TicketModel.add(newTicket)
            res.status(200).json(await TicketModel.getById(result.insertedId))
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    get: async (req, res) => {
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

module.exports = ticketController