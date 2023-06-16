const { flightModel } = require("../models/flight.M")
const { flightStatisticModel } = require("../models/flightStatistic.M")
const Converter = require("../untils/Converter")

class ReportController {
    calculateRevenue = (flightStatistics) => {
        const res = flightStatistics.reduce((acc, flightStatistic) => {
            const ticketsNumber = flightStatistic.numberOfSeat - flightStatistic.numberOfEmptySeat
            const revenue = flightStatistic.price * ticketsNumber
            return acc + revenue
        }, 0)

        return res
    }
    calculateTotalSeat = (flightStatistics) => {
        const res = flightStatistics.reduce((acc, flightStatistic) => {
            return acc + flightStatistic.numberOfSeat
        }, 0)
        return res
    }
    countTickets = (flightStatistics) => {
        const res = flightStatistics.reduce((acc, flightStatistic) => {
            const ticketsNumber = flightStatistic.numberOfSeat - flightStatistic.numberOfEmptySeat
            return acc + ticketsNumber
        }, 0)
        return res
    }
    genFlightReport = async (flight) => {
        const flightStatistics = await flightStatisticModel.getByFlightId(flight._id)

        const numberOfTicket = this.countTickets(flightStatistics)
        const numberOfSeat = this.calculateTotalSeat(flightStatistics)
        const percentage = Converter.toPercentageString(
            numberOfTicket / numberOfSeat
        )
        const revenue = this.calculateRevenue(flightStatistics)
        return {
            flightId: flight._id,
            numberOfTicket,
            numberOfSeat,
            percentage,
            revenue
        }
    }
    get = async (req, res) => {
        try {
            const flights = await flightModel.all()
            const flightReports = await Promise.all(
                flights.map(async (flight) => {
                    return await this.genFlightReport(flight)
                }))
            res.status(200).json(flightReports)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    getByYear = async (req, res) => {
        try {
            const { year } = req.params
            const flights = await flightModel.getByYear(year)
            const flightReports = await Promise.all(
                flights.map(async (flight) => {
                    const flightReport = await this.genFlightReport(flight)
                    return {
                        dateTime: flight.dateTime,
                        ...flightReport
                    }
                }))
            const yearReport = flightReports.reduce((acc, flightReport) => {
                const month = flightReport.dateTime.getMonth() + 1
                if (!acc.hasOwnProperty(month)) {
                    acc[month] = {
                        numberOfFlight: 0,
                        revenue: 0,
                        numberOfTicket: 0,
                        numberOfSeat: 0
                    }
                }

                acc[month].numberOfFlight++
                acc[month].revenue += flightReport.revenue
                acc[month].numberOfTicket += flightReport.numberOfTicket
                acc[month].numberOfSeat += flightReport.numberOfSeat

                return acc
            }, {})
            
            // calculate percentage
            Object.keys(yearReport).forEach(month => {
                const monthReport = yearReport[month];

                yearReport[month].percentage = Converter.toPercentageString(
                    monthReport.numberOfTicket / monthReport.numberOfSeat
                )
            });

            res.status(200).json(yearReport)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message })
        }
    }
}

module.exports = new ReportController