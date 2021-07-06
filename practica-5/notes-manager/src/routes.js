const media = require('./api/media')

module.exports = (app) => {
  app.get('/', (_, res) => {
    res.status(200).send('Hello World!')
  })
  media(app)
}
