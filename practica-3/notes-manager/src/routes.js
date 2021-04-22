const fs = require('fs')

const fileName = './notes.json'

module.exports = (app, db) => {
  app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
  })

  app.get('/notes', (req, res) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        return res.status(400).send(err.message)
      }
      res.status(200).type('application/json').send(data)
    })
  })

  app.get('/notes/:id', (req, res) => {
    const { id } = req.params

    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        return res.status(400).send(err.message)
      }

      const notes = JSON.parse(data)
      if (!notes[id]) {
        return res.status(400).send('Note with such ID not found!')
      }
      res.status(200).type('application/json').send(notes[id])
    })
  })

  app.post('/notes', (req, res) => {
    const id = Date.now()
    const body = { id, ...req.body }

    fs.readFile(fileName, (err, data) => {
      const notes = JSON.parse(data)
      notes[id] = body

      fs.writeFile(fileName, JSON.stringify(notes), (err) => {
        if (err) {
          return res.status(400).send(err.message)
        }
        res.status(200).type('application/json').send(body)
      })
    })
  })

  app.put('/notes/:id', (req, res) => {
    const { id } = req.params
    const { title, content } = req.body

    if (!title || !content) {
      res.status(400).send('Pls provide data to update!')
    }

    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        return res.status(400).send(err.message)
      }

      const notes = JSON.parse(data)
      if (!notes[id]) {
        return res.status(400).send('Note with such ID not found!')
      }

      notes[id] = { id, title, content }

      fs.writeFile(fileName, JSON.stringify(notes), (err) => {
        if (err) {
          return res.status(400).send(err.message)
        }
        res.status(200).type('application/json').send(notes[id])
      })
    })
  })

  app.delete('/notes/:id', (req, res) => {
    const { id } = req.params

    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        return res.status(400).send(err.message)
      }

      const notes = JSON.parse(data)
      if (!notes[id]) {
        return res.status(400).send('Note with such ID not found!')
      }

      const { id: deletedId, ...rest } = notes
      fs.writeFile(fileName, JSON.stringify(rest), (err) => {
        if (err) {
          return res.status(400).send(err.message)
        }
        res.status(200).type('application/json').send(rest)
      })
    })
  })
}
