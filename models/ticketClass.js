const { ObjectId } = require('mongodb');
const { database } = require('../configs/mongodb');
const databaseTC = database.collection('ticketclass');
const { createDebug } = require('../untils/DebugHelper');
const debug = new createDebug('/models/ticketclass');

const TicKetClass = function (tclass) {
  this.name = tclass.name;
  return this;
};

const ticketClassMethod = {
  getAll: async () => {
    const resp = await databaseTC.find({}).toArray();
    return resp;
  },
  getById: async (id) => {
    const ticketClass = await databaseTC.findOne({_id: new ObjectId(id)})
    return ticketClass
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
