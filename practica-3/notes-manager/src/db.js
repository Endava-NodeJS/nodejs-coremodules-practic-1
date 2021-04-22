const { open, Database, Statement } = require('sqlite')

module.exports = () =>
  new Promise((resolve, reject) => {
    open({
      filename: '../db/data.db',
      driver: Database,
    })
      .then((db) => {
        return resolve(db)
      })
      .catch(reject)
  })
