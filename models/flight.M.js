const { ObjectId } = require("mongodb");
const BaseModel = require("./BaseModel");
const { airportModel } = require("./airport.M");
const { flightStatisticModel, FlightStatistic } = require("./flightStatistic.M");
const { ticketClassMethod } = require("./ticketClass");

const tbName = 'flight';
class Flight {
    constructor(dateTime, flightTime, numberOfEmptySeat, numberOfBookedSeat, fromAirport, toAirport, flightStatistics) {
        this.dateTime = dateTime
        this.flightTime = flightTime
        this.numberOfBookedSeat = numberOfBookedSeat
        this.numberOfEmptySeat = numberOfEmptySeat
        this.fromAirport = new ObjectId(fromAirport)
        this.toAirport = new ObjectId(toAirport)
        this.flightStatistics = flightStatistics
    }
}
class FlightModel extends BaseModel {
    constructor() {
        super(tbName)
    }
    async add(flight) {
        const { flightStatistics, ...flightInfo } = flight
        const res = await this.collection.insertOne({
            ...flightInfo,
            status: true
        })
        await Promise.all(
            flightStatistics.map(flightStatistic =>
                flightStatisticModel.add(
                    new FlightStatistic(res.insertedId,
                        ...Object.values(flightStatistic))
                )))
        return res;
    }
    async getFlights(criteria) {
        const pipelines = [
            {
                $lookup: {
                    from: "flightStatistic",
                    let: { "id": "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$flightId", "$$id"]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "ticketclass",
                                localField: "classOfTicket",
                                foreignField: "_id",
                                as: "classOfTicket"
                            }
                        },
                        {
                            $addFields: {
                                "classOfTicket": { "$arrayElemAt": ["$classOfTicket", 0] }
                            }
                        }
                    ],
                    as: "flightStatistics"
                }
            }
        ]
        if (criteria)
            pipelines.push(criteria)
        const flights = await this.collection.aggregate(pipelines).toArray()
        return flights
    }
    async all() {
        const flights = await this.getFlights()
        return flights
    }
    async getSearchResult(fromAirport, toAirport, dateTime) {
        let criteriaObj = {
            fromAirport,
            toAirport,
            dateTime
        }
        criteriaObj = Object.fromEntries(
            Object.entries(criteriaObj).filter(([key, value]) => value !== undefined)
        );
        const criteria =
        {
            $match: criteriaObj
        }
        console.log(criteriaObj)
        const flights = criteriaObj
            ? await this.getFlights(criteria)
            : await this.getFlights()
        return flights
    }
}
module.exports = {
    Flight,
    flightModel: new FlightModel
};