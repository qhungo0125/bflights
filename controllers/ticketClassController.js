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
        const { page = 1, perPage = 5 } = req.query;
        try {
            const ticketClasses = await ticketClassMethod.getAll();

            const startIdx = (page - 1) * perPage;
            const endIdx = page * perPage;

            const tcData = ticketClasses.slice(startIdx, endIdx);

            if (tcData.length == 0) {
                return res.status(200).json([]);
            }

            return res.status(200).json(tcData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

module.exports = new TicketClassController();
