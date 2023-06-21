const { ObjectId } = require('mongodb');
const { database } = require('../configs/mongodb');
const databaseTC = database.collection('ticketclass');
databaseTC.createIndex(
  {
    name: 1
  },
  {
    unique: true,
    partialFilterExpression: { status: true },
    collation: {
      locale: "en",
      strength: 1
    }
  }
)
const { createDebug } = require('../untils/DebugHelper');
const debug = new createDebug('/models/ticketclass');

const TicKetClass = function (tclass) {
  this.name = tclass.name;
  return this;
};

const ticketClassMethod = {
  getAll: async () => {
    const resp = await databaseTC.find({
      status: true
    }).toArray();
    return resp;
  },
  getById: async (id) => {
    const ticketClass = await databaseTC.findOne({
      _id: new ObjectId(id),
      status: true
    })
    return ticketClass
  },
  add: async (ticketClassObj) => {
    const newDoc = {
      ...ticketClassObj,
      status: true
    }
    const res = await databaseTC.insertOne(newDoc)
    res.doc = {
      _id: res.insertedId,
      ...newDoc
    }
    return res
  },
  deleteById: async (id) => {
    const res = await databaseTC.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: false
        }
      }
    )
    return res
  },
  init: async () => {
    debug('called');
    const h1 = new TicKetClass({ name: 'Hang 1' });
    const h2 = new TicKetClass({ name: 'Hang 2' });
    const resp = await databaseTC.insertMany([h1, h2]);
    return resp;
  }
};

module.exports = { TicKetClass, ticketClassMethod };
