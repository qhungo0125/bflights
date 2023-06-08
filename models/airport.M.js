
const { ObjectId } = require("mongodb");
const BaseModel = require("./BaseModel");

const tbName = 'airport';
class Airport {
    constructor(name) {
        this.name = name
    }
}

class AirportModel extends BaseModel {
    constructor() {
        super(tbName)
        this.collection.createIndex({ name: 1 }, { unique: true })
    }
    async getAll() {
        const querry = await this.collection.find({
            status: true
        }).toArray()
        return querry
    }
    async addNew(airport) {
        const res = await this.collection.insertOne({
            ...airport,
            status: true
        })
        return res
    }
    async getById(id) {
        const res = await this.collection.findOne({
            _id: new ObjectId(id),
            status: true
        })
        return res
    }
    async getByName(name) {
        const res = await this.collection.findOne(
            {
                name: name,
                status: true
            }
        )
        return res
    }
    async updateById(id, field, value) {
        const res = await this.collection.updateOne(
            {
                _id: new ObjectId(id),
                status: true
            },
            { $set: { [field]: value } }
        )
        return res
    }
    async deleteById(id) {
        const res = await this.collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { value: false } }
        )
        return res
    }
}
module.exports = { Airport, airportModel: new AirportModel };