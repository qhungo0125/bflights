const { ObjectId } = require("mongodb");
const BaseModel = require("./BaseModel");

const tbName = 'transitionAirport';
class TransitionAirport {
    constructor(_id, flightId, airportId, transitionDuration, note) {
        try {
            this._id = _id ? new ObjectId(_id) : _id
            this.flightId = flightId ? new ObjectId(flightId) : flightId
            this.airportId = airportId ? new ObjectId(airportId) : airportId
            this.transitionDuration = transitionDuration
            this.note = note
        } catch (error) {
            throw new Error("Invalid id")
        }
    }
}
class TransitionAirportModel extends BaseModel {
    constructor() {
        super(tbName)
        this.collection.createIndex(
            {
                flightId: 1,
                airportId: 1
            },
            { unique: true }
        )
    }
    async add(transitionAirport) {
        const { _id, ...transitionAirportInfo } = transitionAirport
        const res = await this.collection.insertOne(
            transitionAirportInfo
        )
        return res
    }
    async getById(id) {
        const transitionAirport = await this.collection.findOne(
            { _id: new ObjectId(id) }
        )
        return transitionAirport
    }
    async getAllOfFlight(flightId) {
        const transitionAirports = await this.collection.find(
            { flightId: new ObjectId(flightId) }
        ).toArray()
        return transitionAirports
    }
    async deleteByFlightAndAirport(flightId, airportId) {
        const deleteRes = await this.collection.deleteOne(
            {
                flightId: new ObjectId(flightId),
                airportId: new ObjectId(airportId)
            }
        )
        return deleteRes
    }
}
module.exports = {
    TransitionAirport,
    TransitionAirportModel: new TransitionAirportModel
};