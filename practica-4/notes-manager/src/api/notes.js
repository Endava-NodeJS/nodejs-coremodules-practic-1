const authGuard = require('../middlewares/auth-guard')
const ownership = require('../middlewares/ownership')

module.exports = (app, db) => {
  app.get('/notes', (req, res) => {
    db.all('SELECT * FROM notes')
      .then((data) => {
        res.status(200).type('application/json').send(data)
      })
      .catch((err) => {
        res.status(400).send(err.message)
      })
  })

  app.get('/notes/:id', authGuard(db), ownership('notes', db), (req, res) => {
    const { id } = req.params
    const { entity: note } = req

    res.status(200).type('application/json').send(note)
  })

  app.post('/notes', authGuard(db), (req, res) => {
    const { title, content } = req.body
    const { user } = req

    db.run(
      `INSERT INTO notes (title, content, userId) values("${title}", "${content}", ${user.id})`
    )
      .then((data) => {
        res.send(200, data.lastID)
      })
      .catch((err) => {
        console.log(err)
        if (err && err.errno == 19) {
          return res.send(400, 'This title already exists')
        }
        return res.status(400).send(err.message)
      })
  })

  app.put('/notes/:id', authGuard(db), ownership('notes', db), (req, res) => {
    const { id } = req.params
    const { title, content } = req.body

    if (!title && !content) {
      res.status(400).send('Pls provide data to update!')
    }

    db.get(`SELECT content, title, id FROM notes WHERE id=${id}`)
      .then((note) => {
        if (!note) {
          return res.status(400).send('Note with such ID not found!')
        }

        const fields = []
        if (title) {
          fields.push(`title="${title}"`)
        }
        if (content) {
          fields.push(`content="${content}"`)
        }

        db.run(`UPDATE notes SET ${fields.join(',')} WHERE id="${id}"`)
          .then((data) => {
            console.log(data)
            res.send(204)
          })
          .catch((err) => {
            console.log(err)
            return res.status(400).send(err.message)
          })
      })
      .catch((err) => {
        return res.status(500).send(err.message)
      })
  })

  app.put(
    '/notes-new/:id',
    authGuard(db),
    ownership('notes', db),
    (req, res) => {
      const { id } = req.params
      const { title, content } = req.body

      if (!title && !content) {
        res.status(400).send('Pls provide data to update!')
      }

      db.get(`SELECT content, title, id FROM notes WHERE id=${id}`)
        .then((note) => {
          if (!note) {
            return res.status(400).send('Note with such ID not found!')
          }

          db.run(
            `UPDATE notes SET title="${title ? title : note.title}", content="${
              content ? content : note.content
            }" WHERE id="${id}"`
          )
            .then((data) => {
              res.send(204, data)
            })
            .catch((err) => {
              return res.status(400).send(err.message)
            })
        })
        .catch((err) => {
          return res.status(500).send(err.message)
        })
    }
  )

  app.delete(
    '/notes/:id',
    authGuard(db),
    ownership('notes', db),
    (req, res) => {
      const { id } = req.params

      db.run(`DELETE FROM notes WHERE id="${id}"`)
        .then((data) => {
          res.status(204).type('application/json').send(data)
        })
        .catch((err) => {
          return res.status(500).send(err.message)
        })
    }
  )
}
