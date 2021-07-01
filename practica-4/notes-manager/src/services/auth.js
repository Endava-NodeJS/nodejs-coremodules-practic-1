const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const jwtSecret = 'secret'
const cryptoSecret = 'silence-is-gold'

exports.hashPassword = function (password) {
  return new Promise((res, rej) => {
    try {
      const hash = crypto
        .createHmac('sha256', cryptoSecret)
        .update(password)
        .digest('hex')

      if (!hash) {
        throw new Error('Unable to create hmac hash, or hash is invalid!', hash)
      }

      res(hash)
    } catch (e) {
      rej(e)
    }
  })
}

exports.comparePasswords = function (dbPassword, password) {
  const { hashPassword } = this

  return new Promise((res, rej) => {
    hashPassword(password)
      .then((hash) => res(hash === dbPassword))
      .catch(rej)
  })
}

exports.encode = (payload) =>
  new Promise((res, rej) =>
    jwt.sign(payload, jwtSecret, { expiresIn: 60 * 60 }, (err, token) => {
      if (err) {
        return rej(err)
      }
      return res(token)
    })
  )

exports.decode = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, jwtSecret, (err, payload) => {
      if (err) {
        return rej(err)
      }
      return res(payload)
    })
  )
