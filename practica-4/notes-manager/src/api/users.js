const auth = require('../configs/auth')

const userRegexp = /^[^\s@]+@[^\s@]+$/i

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

  app.post('/signup', (req, res) => {
    const { email, password, confirmPassword } = req.body

    if (!email) {
      return res.status(400).send('Pls provide user email!')
    }

    if (!userRegexp.test(email)) {
      return res.status(400).send('Pls provide correct email!')
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

    auth
      .hashPassword(password)
      .then((hash) => {
        db.run(
          `INSERT INTO users (email, password) values("${email}", "${hash}")`
        )
          .then((data) => {
            // send confirmation email service and activation link
            res.send(200, data.lastID)
          })
          .catch((err) => {
            console.log(err)
            if (err && err.errno == 19) {
              return res.send(400, 'This email already exists')
            }
            return res.status(400).send(err.message)
          })
      })
      .catch((err) => {
        console.log(err)
        return res.status(500).send('Internal server error')
      })
  })

  app.post('/signin', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).send('Email or password is not valid!')
    }

    if (!userRegexp.test(email)) {
      return res.status(400).send('Pls provide correct email!')
    }

    db.get(`SELECT * FROM users WHERE email="${email}"`)
      .then((user) => {
        if (!user) {
          return res.status(400).send('This user does not exists!')
        }

        const { password: dbPassword, ...userData } = user

        auth
          .hashPassword(password)
          .then((hashedPassword) => {
            console.log(dbPassword, hashedPassword)
            if (hashedPassword !== dbPassword) {
              return res.status(400).send('Password is not correct!')
            }
            auth
              .encode(user)
              .then((token) => {
                return res
                  .status(200)
                  .type('application/json')
                  .send({ ...userData, token })
              })
              .catch((err) => {
                return res.status(500).send(err.message)
              })
          })
          .catch((err) => {
            return res.status(500).send(err.message)
          })
      })
      .catch((err) => {
        return res.status(500).send(err.message)
      })
  })
}
