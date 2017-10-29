var MongoClient = require('mongodb').MongoClient

class Database
{
  constructor() {
    this.url = 'mongodb://localhost:27017/myproject';
    this.connection = null;
    this.connect();
  }

  connect() {
    if (this.connection !== null) {
      return;
    }

    return new Promise((resolve, reject) => {
      MongoClient.connect(this.url, (err, db) => {
        if (err !== null) {
          return reject(err);
        }

        this.connection = db;
      })
    });
  }

  close() {
    if (this.connection !== null) {
      // this.connection.close();
    }
  }

  open(callback) {
    MongoClient.connect(this.url, (err, db) => {
      console.log("Connected successfully to server");
      callback(db);
    });
  }

  async insert(collectionName, data, callback) {
    await this.connect();
    this.connection
        .collection(collectionName)
        .insertMany(data, (err, result) => {
          if (err !== null) {
            console.log('ERROR_INSERT: ' + err);
          } else {
            console.log('Insert successfully');
          }
          callback(err, result);

          this.close();
        })
  }

  async find(collectionName, query, callback) {
    await this.connect();
    this.connection
        .collection(collectionName)
        .find(query)
        .toArray((err, result) => {
          callback(err, result);

          this.close();
        })
  }

  async delete(collectionName, query, callback) {
    await this.connect();
    this.connection
        .collection(collectionName)
        .deleteMany(query, (err, data) => {
          callback(err, data);
          this.close();
        })
  }
}

module.exports = new Database();
