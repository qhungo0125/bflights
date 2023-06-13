const { ObjectId } = require("mongodb");
const BaseModel = require("./BaseModel");

const tbName = 'ticket';
class TransitionAirport {
    constructor(flightId, classOfTicket, userId) {
        this.flight = new ObjectId(flightId)
        this.classOfTicket = new ObjectId(classOfTicket)
        this.user = new ObjectId(userId)
    }
}
class TransitionAirportModel extends BaseModel {
    constructor() {
        super(tbName)
    }
    async add(ticket) {
        const result = await this.collection.insertOne(ticket)
        return result
    }
    async getAllTicket(userId) {
        const pipelines = [
            {
                $lookup: {
                    from: "flight",
                    localField: "flight",
                    foreignField: "_id",
                    as: "flight"
                }
            },
            {
                $lookup: {
                    from: "ticketclass",
                    localField: "classOfTicket",
                    foreignField: "_id",
                    as: "classOfTicket"
                }
            }
        ]
        const tickets = await this.collection.aggregate(pipelines).toArray()
        return tickets
    }
}
module.exports = {
    Ticket: TransitionAirport,
    TicketModel: new TransitionAirportModel
};