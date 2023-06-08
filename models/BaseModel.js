const { database } = require("../configs/mongodb")

database
class BaseModel {
    constructor(collName){
        this.collection = database.collection(collName)
    }
}

module.exports = BaseModel