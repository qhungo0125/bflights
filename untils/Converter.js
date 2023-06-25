class Converter {
    toPercentageString(floatNumber) {
        return (floatNumber * 100).toFixed(2) + "%"
    }
    convertHourtoMilisecond(numOfDay) {
        return numOfDay * 60 * 60 * 1000
    }
}

module.exports = new Converter