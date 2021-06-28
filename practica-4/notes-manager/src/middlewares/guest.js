module.exports = (req, res, next) => {
  const { token } = req.headers
  if (token) {
    return res.send(403, 'Forbidden')
  }
  next()
}
