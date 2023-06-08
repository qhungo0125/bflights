const { ObjectId } = require("bson");
const { database } = require("../configs/mongodb");
const BaseModel = require("./BaseModel");

const tbName = 'flightStatistic';
class FlightStatistic {
    constructor(flightId, classOfTicket, numberOfSeat) {
        this.flightId = new ObjectId(flightId)
        this.classOfTicket = new ObjectId(classOfTicket)
        this.numberOfSeat = numberOfSeat
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
    async getByFlightId(flightId) {
        const res = await this.collection.find({
            flightId: new ObjectId(flightId)
        }).toArray()
        return res
    }
}
module.exports = {
    FlightStatistic,
    flightStatisticModel: new FlightStatisticModel
};