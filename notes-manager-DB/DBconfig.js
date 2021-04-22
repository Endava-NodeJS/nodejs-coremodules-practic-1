const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let db = null;
exports.db = db;

const connect = () =>
  Promise((resolve, reject) => {
    if (!db) {
      open({
        filename: '/tmp/database.db',
        driver: sqlite3.Database,
      })
        .then(dbConnected => {
          db = dbConnected;
          return resolve(db);
        })
        .catch(reject);
    }
    resolve(db);
  });
exports.connect = connect;
