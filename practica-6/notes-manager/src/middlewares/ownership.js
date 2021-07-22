module.exports = (entity, db) => (req, res, next) => {
  const { id } = entity == 'users' ? req.user : req.params
  const { user } = req

  if (!user) {
    return res.send(500, 'Your user is invalid')
  }
  db.get(`SELECT * FROM ${entity} WHERE id=${id}`)
    .then((item) => {
      console.log(item.userId)
      console.log(user.id)
      if (entity !== 'users' && item.userId !== user.id) {
        return res.send(403, 'The entity is not under your ownership')
      }
      req.entity = item
      next()
    })
    .catch((err) => {
      console.log(err)
      return res.send(404, `Entity ${entity} not found`)
    })
}
