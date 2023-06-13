const { ticketClassMethod } = require("../models/ticketClass")

class TicketClassController {
    checkExistedId = async (id) => {
        try {
            const res = await ticketClassMethod.getById(id)
            if (res)
                return true
            else
                return false
        } catch (error) {
            return false
        }

    }
}

module.exports = new TicketClassController