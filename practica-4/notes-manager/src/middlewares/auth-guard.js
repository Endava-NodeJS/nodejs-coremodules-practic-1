const auth = require('../services/auth')

module.exports = (db) => (req, res, next) => {
  const { token } = req.headers
  auth
    .decode(token)
    .then(({ email, password }) => {
      db.get(`SELECT * FROM users WHERE email="${email}"`)
        .then((user) => {
          if (user.password !== password) {
            return res.send(400, 'Your token is invalid')
          }
          req.user = user
          next()
        })
        .catch((err) => res.send(400, 'Your user is invalid'))
    })
    .catch((err) => {
      console.log(err)
      return res.send(400, 'Your token is invalid')
    })
}
