const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const saltRounds = 10

const jwtSecret = 'secret'

exports.hashPassword = (password) =>
  new Promise((res, rej) =>
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        return rej(err)
      }
      res(hash)
    })
  )

exports.comparePasswords = (dbPassword, password) =>
  new Promise((res, rej) =>
    bcrypt.compare(password, dbPassword, function (err, result) {
      if (err) {
        return rej(err)
      }
      res(result)
    })
  )

exports.encode = (payload) =>
  new Promise((res, rej) =>
    jwt.sign(payload, jwtSecret, { expiresIn: 60 * 60 }, (err, token) => {
      if (err) {
        return rej(err)
      }
      return res(token)
    })
  )
