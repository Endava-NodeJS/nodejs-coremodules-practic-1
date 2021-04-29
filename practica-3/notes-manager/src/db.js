const { open } = require('sqlite');
const path = require('path');

const dbPath = path.join(__dirname, '../db/data.db');

module.exports = () =>
  new Promise((resolve, reject) => {
    open(dbPath)
      .then(db => {
        db.run('CREATE TABLE IF NOT EXISTS notes (id INTEGER NOT NULL PRIMARY KEY, title TEXT UNIQUE, content TEXT)')
          .then(() => {
            db.all('SELECT * FROM notes')
              .then(data => {
                if (!data.length) {
                  db.run('INSERT INTO notes (title, content) values("First title", "Content goes here")')
                    .then(() => resolve(db))
                    .catch(reject);
                }
              })
              .catch(reject);
            return resolve(db);
          })
          .catch(reject);
      })
      .catch(reject);
  });
