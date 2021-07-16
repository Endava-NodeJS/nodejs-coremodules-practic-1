const auth = require('../services/auth')

module.exports = (db) => (req, res, next) => {

  const { token } = req.headers
  if (!token) {
    return res.status(401).send('Token is required')
  }

  auth
    .decode(token)
    .then(({ id, password }) => {
      db.get(`SELECT * FROM users WHERE id="${id}"`)
        .then((user) => {
          if (user.password !== password) {
            return res.status(400).send('Your token is invalid')
          }
          req.user = user
          next()
        })
        .catch((err) => res.status(400).send('Your user is invalid'))
    })
    .catch((err) => {
      console.log(err)
      return res.status(400).send('Your token is invalid')
    })
}
