const database = require('../libs/database');
const ObjectId = require('mongodb').ObjectID;

class Models
{
  db() {
    return database;
  }

  ObjectId(id) {
    return ObjectId(id);
  }
}

module.exports = Models;
