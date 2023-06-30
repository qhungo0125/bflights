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
            this.fromAirport = fromAirport ? new ObjectId(fromAirport) : fromAirport
            this.toAirport = toAirport ? new ObjectId(toAirport) : toAirport
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
                await flightStatisticModel.add(flightStatistic)
            })

        )
        return res;
    }
    async addNewTicketClass(classOfTicket) {
        await this.collection.find({}).map(async (doc) => {
            const flightStatistic = new FlightStatistic(null, doc._id, classOfTicket, 0, 0, null)
            flightStatisticModel.add(flightStatistic)
        }).toArray()
    }
    async all() {
        // const flights = await this.getFlights()
        const flights = await this.collection.find(
            { status: true }
        ).sort({ dateTime: -1 }).toArray()
        return flights
    }
    async getById(id) {
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
        if (criteriaObj.hasOwnProperty("dateTime")) {
            new Date().getFullYear
            const oldDate = criteriaObj.dateTime
            const fromDate = new Date(oldDate.getFullYear(), oldDate.getMonth(), oldDate.getDate())
            const toDate = new Date(oldDate.getFullYear(), oldDate.getMonth(), oldDate.getDate() + 1)

            criteriaObj.dateTime = {
                $gte: fromDate,
                $lt: toDate
            }
        }
        const flights = await this.collection.find(
            {
                ...criteriaObj,
                status: true
            }
        ).sort({ dateTime: -1 }).toArray()
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
    async getReport(genReportFunc, year) {
        const filter = {
            $match: {
                status: true
            }
        }
        if (year) {
            filter.$match.dateTime = {
                $gte: new Date(year, 0, 1),
                $lt: new Date(year + 1, 0, 1)
            }
        }
        const res = await this.collection.aggregate([
            filter,
            { $sort: { dateTime: -1 } },
            {
                $lookup: {
                    from: 'flightStatistic', localField: '_id', foreignField: 'flightId',
                    as: 'flightStatistics'
                }
            },
            { $project: { dateTime: 1, flightStatistics: 1, dateTime: 1 } }
        ]).map((doc) => {
            return { dateTime: doc.dateTime, flightId: doc._id, ...genReportFunc(doc.flightStatistics) }
        }).toArray()
        return res
    }
}
module.exports = {
    Flight,
    flightModel: new FlightModel
};