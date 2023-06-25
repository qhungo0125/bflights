const { ObjectId } = require('mongodb');
const { flightStatisticModel } = require('../models/flightStatistic.M');
const { Ticket, TicketModel } = require('../models/ticket.M');
const { userMethod } = require('../models/user');
const flightStatisticController = require('./flightStatisticController');
const termsController = require('./termsController');
const { flightModel } = require('../models/flight.M');
class TicketController {
    getUser = async (request) => {
        const user = await userMethod.findUserByCondition({
            name: 'email',
            value: request.user.email
        });
        return user;
    };
    verifyTicketOwner = async (req, res, next) => {
        try {
            const user = await this.getUser(req);
            let { ticketId } = req.params;
            try {
                ticketId = new ObjectId(ticketId);
            } catch (error) {
                throw new Error('Invalid Id');
            }
            const ticket = await TicketModel.getById(ticketId);
            if (!ticket) {
                throw new Error(
                    'Ticket was not found or has already been deleted.'
                );
            }
            if (!user._id.equals(ticket.userId)) {
                throw new Error(
                    'You do not have permission to perform operations on the ticket.'
                );
            }
            req.ticket = ticket;
            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    };
    checkValidTicket = async (ticketObj) => {
        const { _id, flightId, classOfTicket, userId } = ticketObj;

        if (!flightId || !classOfTicket || !userId)
            throw new Error('Missing required infomation');

        if (
            !(await flightStatisticController.checkExistedByFlightAndTicketClass(
                flightId,
                classOfTicket
            ))
        ) {
            throw new Error('Flight Statistic is not existed');
        }


        const flight = await flightModel.getById(flightId)
        await termsController.checkValidBookedTime(new Date(), flight.dateTime)
    };
    post = async (req, res) => {
        try {
            const { flightId, classOfTicket } = req.body;

            const user = await this.getUser(req);
            const newTicket = new Ticket(
                null,
                flightId,
                classOfTicket,
                user._id
            );
            await this.checkValidTicket(newTicket);

            const decreaseEmptySeatResult =
                await flightStatisticModel.decreaseEmptySeat(
                    flightId,
                    classOfTicket
                );
            if (decreaseEmptySeatResult.modifiedCount === 0) {
                throw new Error('No empty seat allow');
            }
            const result = await TicketModel.add(newTicket);
            res.status(200).json(await TicketModel.getById(result.insertedId));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    get = async (req, res) => {
        try {
            const user = await this.getUser(req);
            const tickets = await TicketModel.getAllTicket(user._id);

            res.status(200).json(tickets);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    delete = async (req, res) => {
        try {
            const ticket = req.ticket;
            const flight = await flightModel.getById(ticket.flightId)
            await termsController.checkValidCancelTime(new Date(), flight.dateTime)
            const increaseEmptySeatResult =
                await flightStatisticModel.increaseEmptySeat(
                    ticket.flightId,
                    ticket.classOfTicket
                );
            if (increaseEmptySeatResult.modifiedCount === 0) {
                throw new Error('An unexpected data error occurred.');
            }
            const result = await TicketModel.deleteById(ticket._id);
            if (result.modifiedCount === 0) {
                throw new Error(
                    'Ticket was not found or has already been deleted.'
                );
            }
            res.status(200).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

module.exports = new TicketController();
