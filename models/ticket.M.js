const { ObjectId } = require("mongodb");
const BaseModel = require("./BaseModel");

const tbName = 'ticket';
class Ticket {
    constructor(flightId, classOfTicket, userId) {
        try {
            this.flight = new ObjectId(flightId)
            this.classOfTicket = new ObjectId(classOfTicket)
            this.user = new ObjectId(userId)

        } catch (error) {
            throw new Error("Invalid Id")
        }
    }
}
class TicketModel extends BaseModel {
    constructor() {
        super(tbName)
    }
    async add(ticket) {
        const result = await this.collection.insertOne(ticket)
        return result
    }
    async getAllTicket(userId) {
        const tickets = await this.collection.find(
            { user: new ObjectId(userId) }
        ).toArray()
        return tickets
    }
    async getById(id) {
        const ticket = await this.collection.findOne(
            { _id: new ObjectId(id) }
        )
        return ticket
    }
}
module.exports = {
    Ticket,
    TicketModel: new TicketModel
};