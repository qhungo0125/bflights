const { MongoServerError } = require('mongodb');
const { ticketClassMethod, TicKetClass } = require('../models/ticketClass');
const { flightStatisticModel } = require('../models/flightStatistic.M');
const { TicketModel } = require('../models/ticket.M');

class TicketClassController {
    checkValidObj = async (ticketClassObj) => {
        if (!ticketClassObj.name) {
            throw new Error("Missing required value")
        }
    }
    checkExistedId = async (id) => {
        try {
            const res = await ticketClassMethod.getById(id);
            if (res) return true;
            else return false;
        } catch (error) {
            return false
        }
    }
    all = async (req, res) => {
        const { page = process.env.page, perPage = process.env.perPage } =
            req.query;
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
    }
    post = async (req, res) => {
        try {
            const { name } = req.body
            const ticketClassObj = new TicKetClass({ name })
            await this.checkValidObj(ticketClassObj)
            const result = await ticketClassMethod.add(ticketClassObj)
            res.status(200).json(result.doc)
        } catch (error) {
            if (error instanceof MongoServerError && [11000, 11001].includes(error.code)) {
                const violatedField = Object.keys(error.keyPattern)[0];
                error.message = `TicketClass's ${violatedField} must be unique`;
            }
            res.status(500).json({ error: error.message });
        }
    }
    del = async (req, res) => {
        try {
            const { ticketClassId } = req.params
            const result = await ticketClassMethod.deleteById(ticketClassId)
            if (result.modifiedCount === 0) {
                throw new Error("Ticket Class not existed or have already been deleted")
            }
            flightStatisticModel.deleteByTicketClass(ticketClassId)
            TicketModel.deleteByTicketClass(ticketClassId)
            res.status(200).send()
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

module.exports = new TicketClassController
