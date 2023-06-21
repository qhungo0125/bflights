const { ticketClassMethod } = require('../models/ticketClass');

class TicketClassController {
    checkExistedId = async (id) => {
        try {
            const res = await ticketClassMethod.getById(id);
            if (res) return true;
            else return false;
        } catch (error) {
            return false;
        }
    };
    all = async (req, res) => {
        try {
            const ticketClasses = await ticketClassMethod.getAll();

            return res.status(200).json(ticketClasses);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

module.exports = new TicketClassController();
