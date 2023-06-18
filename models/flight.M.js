const { ObjectId } = require("mongodb");
const BaseModel = require("./BaseModel");
const { airportModel } = require("./airport.M");
const { flightStatisticModel, FlightStatistic } = require("./flightStatistic.M");
const { ticketClassMethod } = require("./ticketClass");

const tbName = 'flight';
class Flight {
    constructor(_id, dateTime, flightDuration, fromAirport, toAirport) {
        try {
            this._id = _id ? new ObjectId(_id) : _id
            this.dateTime = new Date(dateTime)
            this.flightDuration = flightDuration
            this.fromAirport = new ObjectId(fromAirport)
            this.toAirport = new ObjectId(toAirport)
        } catch (error) {
            throw new Error("Invalid Id")
        }
    }
}
class FlightModel extends BaseModel {
    constructor() {
        super(tbName)
    }
    async add(flight) {
        const res = await this.collection.insertOne({
            ...flight,
            status: true
        })
        await Promise.all(
            (await ticketClassMethod.getAll()).map(async (ticketClass) => {
                const flightStatistic = new FlightStatistic(null, res.insertedId, ticketClass._id, 0, 0, null)
                const { _id, ...flightObj } = flightStatistic
                await flightStatisticModel.add(flightObj)
            })

        )
        return res;
    }
    async all() {
        // const flights = await this.getFlights()
        const flights = await this.collection.find(
            { status: true }
        ).toArray()
        return flights
    }
    async getById(id) {
        // const pipeline = {
        //     $match: { _id: new ObjectId(id) }
        // }
        // const flights = (await this.getFlights(pipeline))
        // if (flights.length > 0)
        //     return flights[0]
        // else
        //     return null
        const flight = await this.collection.findOne({
            _id: new ObjectId(id),
            status: true
        })
        return flight
    }
    async updateById(flightObj) {
        const { _id, ...flightInfo } = flightObj
        const res = await this.collection.findOneAndUpdate(
            {
                _id: new ObjectId(_id),
                status: true
            },
            {
                $set: flightObj
            },
            { returnDocument: "after" }
        )
        return res;
    }
    async getSearchResult(fromAirport, toAirport, dateTime) {
        let criteriaObj = {
            fromAirport,
            toAirport,
            dateTime,
        }
        criteriaObj = Object.fromEntries(
            Object.entries(criteriaObj).filter(([key, value]) => value !== undefined)
        );
        // const criteria =
        // {
        //     $match: criteriaObj
        // }
        // const flights = criteriaObj
        //     ? await this.getFlights(criteria)
        //     : await this.getFlights()
        const flights = await this.collection.find(
            {
                ...criteriaObj,
                status: true
            }
        ).toArray()
        return flights
    }
    async deleteById(id) {
        const res = await this.collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    status: false
                }
            }
        )
        return res
    }
    async getByYear(year) {
        const fromDate = new Date(year, 0, 1)
        const toDate = new Date(year + 1, 0, 1)
        const filter = {
            status: true,
            dateTime: {
                $gte: fromDate,
                $lt: toDate
            }
        }
        const res = await this.collection.find(filter).toArray()
        return res
    }
}
module.exports = {
    Flight,
    flightModel: new FlightModel
};