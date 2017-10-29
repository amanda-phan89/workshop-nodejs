const Models = require('./models');

class Images extends Models
{
  constructor() {
    super();
    this.collection = 'galleries';
  }

  insert(data, callback) {
    this.db()
        .insert(this.collection, data, (err, result) => {
          callback(err, result);
        });
  }

  find(query, callback) {
    this.db()
        .find(this.collection, query, (err, result) => {
          callback(err, result);
        });
  }

  delete(query, callback) {
    this.db()
    .delete(this.collection, query, (err, result) => {
      callback(err, result);
    });
  }
}

module.exports = new Images();
