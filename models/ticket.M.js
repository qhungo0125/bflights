const { ObjectId } = require("mongodb");
const BaseModel = require("./BaseModel");

const tbName = 'ticket';
class Ticket {
    constructor(flightId, classOfTicket, userId) {
        try {
            this.flightId = new ObjectId(flightId)
            this.classOfTicket = new ObjectId(classOfTicket)
            this.userId = new ObjectId(userId)

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
    async getFullTicketInfo(additionalPipeline) {
        const pipeline = [
            {
                $lookup: {
                    from: "flightStatistic",
                    let: { "flightId": "$flightId", "classOfTicket": "$classOfTicket" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$flightId", "$$flightId"] },
                                        { $eq: ["$classOfTicket", "$$classOfTicket"] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                price: 1
                            }
                        }
                    ],
                    as: "price"
                }
            },
            {
                $addFields: {
                    price: { $arrayElemAt: ["$price.price", 0] }
                }
            }
        ]
        if (additionalPipeline) {
            pipeline.push(additionalPipeline)
        }
        const res = await this.collection.aggregate(pipeline).toArray()
        return res
    }
    async getAllTicket(userId) {
        const pipeline = {
            $match: {
                userId: new ObjectId(userId)
            }
        }
        const tickets = await this.getFullTicketInfo(pipeline)
        // const tickets = await this.collection.find(
        //     { user: new ObjectId(userId) }
        // ).toArray()
        return tickets
    }
    async getById(id) {
        const pipeline = {
            $match: {
                _id: new ObjectId(id)
            }
        }

        const tickets = await this.getFullTicketInfo(pipeline)

        if (tickets.length > 0) {
            return tickets[0]
        } else {
            return null
        }
    }
}
module.exports = {
    Ticket,
    TicketModel: new TicketModel
};