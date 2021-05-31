const notesApi = require('./api/notes')
const usersApi = require('./api/users')

module.exports = (app, db) => {
  app.get('/', (_, res) => {
    res.status(200).send('Hello World!')
  })
  notesApi(app, db)
  usersApi(app, db)
}
