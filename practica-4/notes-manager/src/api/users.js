const bcrypt = require('bcrypt')
const saltRounds = 10
const userRegexp = /^[a-z]*[0-9]*$/gi

const hashPassword = (password) =>
  new Promise((res, rej) =>
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        return rej(err)
      }
      res(hash)
    })
  )

const comparePasswords = (dbPassword, password) =>
  new Promise((res, rej) =>
    bcrypt.compare(password, dbPassword, function (err, result) {
      if (err) {
        return rej(err)
      }
      res(result)
    })
  )

module.exports = (app, db) => {
  app.get('/users', (req, res) => {
    db.all('SELECT * FROM users')
      .then((data) => {
        res.status(200).type('application/json').send(data)
      })
      .catch((err) => {
        res.status(400).send(err.message)
      })
  })

  app.post('/users', (req, res) => {
    const { userName, password, confirmPassword } = req.body

    if (!userName) {
      return res.status(400).send('Pls provide user name!')
    }
    console.log(userName, !userRegexp.test(userName))

    if (!userRegexp.test(userName)) {
      return res
        .status(400)
        .send('Pls use only alpha numeric characters for username!')
    }

    if (!password || !confirmPassword) {
      return res
        .status(400)
        .send('Please provide password and confirm password')
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .send('Password and confirm password does not match')
    }

    hashPassword(password)
      .then((hash) => {
        db.run(
          `INSERT INTO users (userName, password) values("${userName}", "${hash}")`
        )
          .then((data) => {
            // send confirmation email service and activation link
            res.send(200, data.lastID)
          })
          .catch((err) => {
            console.log(err)
            if (err && err.errno == 19) {
              return res.send(400, 'This userName already exists')
            }
            return res.status(400).send(err.message)
          })
      })
      .catch((err) => {
        console.log(err)
        return res.status(500).send('Internal server error')
      })
  })
}
