const { ObjectId } = require('mongodb')
const BaseModel = require('./BaseModel')

const tbName = 'airport'
class Airport {
    constructor(_id, name) {
        try {
            this._id = _id ? new ObjectId(_id) : _id
            this.name = name
        } catch (error) {
            throw new Error('Invalid Id')
        }
    }
}

class AirportModel extends BaseModel {
    constructor() {
        super(tbName)
        this.collection.createIndex(
            { name: 1 },
            {
                unique: true,
                partialFilterExpression: { status: true },
                collation: {
                    locale: "vi",
                    strength: 2
                }
            }
        )
    }
    async getAll() {
        const querry = await this.collection
            .find({
                status: true
            })
            .toArray()
        return querry
    }
    async addNew(airport) {
        const { _id, ...airportInfo } = airport
        const res = await this.collection.insertOne({
            ...airportInfo,
            status: true
        })
        return res
    }
    async getById(id) {
        const res = await this.collection.findOne({
            _id: new ObjectId(id),
        })
        return res
    }
    async getByName(name) {
        const res = await this.collection.findOne({
            name: name,
            status: true
        })
        return res
    }
    async updateById(airportObj) {
        const { _id, ...airportInfo } = airportObj
        const res = await this.collection.findOneAndUpdate(
            {
                _id: new ObjectId(_id),
                status: true
            },
            {
                $set: airportInfo
            },
            { returnDocument: 'after' }
        )
        return res
    }
    async deleteById(id) {
        const res = await this.collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: false } }
        )
        return res
    }
}
module.exports = { Airport, airportModel: new AirportModel() }
