class Converter {
    toPercentageString(floatNumber) {
        return (floatNumber * 100).toFixed(2) + "%"
    }
}

module.exports = new Converter