const { ObjectId } = require("bson");
const BaseModel = require("./BaseModel");

const tbName = 'flightStatistic';
class FlightStatistic {
    constructor(_id, flightId, classOfTicket, numberOfSeat, numberOfEmptySeat, price) {
        try {
            this._id = _id ? new ObjectId(_id) : _id
            this.flightId = flightId ? new ObjectId(flightId) : flightId
            this.classOfTicket = new ObjectId(classOfTicket)
            this.numberOfSeat = numberOfSeat
            this.numberOfEmptySeat = numberOfEmptySeat
            this.price = price
        } catch (error) {
            throw new Error("Invalid Id")
        }
    }
}
class FlightStatisticModel extends BaseModel {
    constructor() {
        super(tbName)
        this.collection.createIndex(
            {
                flightId: 1,
                classOfTicket: 1
            },
            { unique: true }
        )
    }
    async add(flightStatistic) {
        const res = await this.collection
            .insertOne(flightStatistic)
        return res;
    }
    async getById(id) {
        const res = await this.collection.findOne(
            { _id: new ObjectId(id) }
        )
        return res
    }
    async getByFlightId(flightId) {
        const res = await this.collection.aggregate([
            {
                $match: {
                    flightId: new ObjectId(flightId)
                }
            },
            {
                $lookup: {
                    from: "ticketclass",
                    let: { "classOfTicket": "$classOfTicket" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$classOfTicket"]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                name: 1
                            }
                        }
                    ],
                    as: "nameOfTicketClass"
                }
            },
            {
                $addFields: {
                    nameOfTicketClass: { $arrayElemAt: ["$nameOfTicketClass.name", 0] }
                }
            }
        ]).toArray()
        return res
    }
    async decreaseEmptySeat(flightId, classOfTicket) {
        const res = await this.collection.updateOne(
            {
                flightId: new ObjectId(flightId),
                classOfTicket: new ObjectId(classOfTicket),
                numberOfEmptySeat: { $gt: 0 }
            },
            {
                $inc: { numberOfEmptySeat: -1 }
            }
        )
        return res
    }
    async updateById(flightStatisticObj) {
        const { _id, ...flightStatisticInfo } = flightStatisticObj
        const res = await this.collection.updateOne(
            { _id: new ObjectId(_id) },
            {
                $set: {
                    ...flightStatisticInfo
                }
            }
        )
        return res
    }
    async updateByFlightAndTicketClass(flightStatisticObj) {
        const { _id, flightId, classOfTicket, ...flightStatisticInfo } = flightStatisticObj
        const res = await this.collection.findOneAndUpdate(
            {
                flightId: flightId,
                classOfTicket: classOfTicket,
                $expr: {
                    $gte: [
                        flightStatisticInfo.numberOfSeat,
                        {
                            $subtract: ["$numberOfSeat", "$numberOfEmptySeat"]
                        }
                    ]
                }
            },
            [
                {
                    $set: {
                        ...flightStatisticInfo,
                        numberOfEmptySeat: {
                            $subtract: [
                                flightStatisticInfo.numberOfSeat,
                                { $subtract: ["$numberOfSeat", "$numberOfEmptySeat"] }
                            ]
                        }
                    }
                }
            ],
            { returnDocument: "after" }
        )
        return res
    }
}
module.exports = {
    FlightStatistic,
    flightStatisticModel: new FlightStatisticModel
};