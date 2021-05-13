const { open } = require('sqlite')
const path = require('path')

const dbPath = path.join(__dirname, '../db/data.db')

module.exports = () =>
  new Promise((resolve, reject) => {
    open(dbPath).then((db) => {
      const queue = [
        new Promise((res, rej) => {
          db.run(
            'CREATE TABLE IF NOT EXISTS notes (id INTEGER NOT NULL PRIMARY KEY, title TEXT UNIQUE, content TEXT)'
          )
            .then(() => {
              db.all('SELECT * FROM notes')
                .then((data) => {
                  if (!data.length) {
                    db.run(
                      'INSERT INTO notes (title, content) values("First title", "Content goes here")'
                    )
                      .then(res)
                      .catch(rej)
                  }
                  return res()
                })
                .catch(rej)
            })
            .catch(rej)
        }),
        new Promise((res, rej) => {
          db.run(
            'CREATE TABLE IF NOT EXISTS users (id INTEGER NOT NULL PRIMARY KEY, userName TEXT UNIQUE, password TEXT)'
          )
            .then(() => {
              db.all('SELECT * FROM users')
                .then((data) => {
                  if (!data.length) {
                    db.run(
                      'INSERT INTO users (userName, password) values("TestUser", "Password1")'
                    )
                      .then( res)
                      .catch(rej)
                  }
                  return res()
                })
                .catch(rej)
            })
            .catch(rej)
        }),
      ]
      Promise.all(queue)
        .then(() => resolve(db))
        .catch(reject)
    })
  })
