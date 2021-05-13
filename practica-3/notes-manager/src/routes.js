const fs = require('fs')

const fileName = './notes.json'

module.exports = (app, db) => {
  app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
  })

  app.get('/notes', (req, res) => {
    db.all('SELECT * FROM notes')
      .then(data => {
        res.status(200).type('application/json').send(data)
      })
      .catch(err => {
        res.status(400).send(err.message)
      })
  })

  app.get('/notes/:id', (req, res) => {
    const { id } = req.params

    db.get(`SELECT content, title, id FROM notes WHERE id=${id}`)
      .then(note => {
        if (!note) {
          return res.status(400).send('Note with such ID not found!')
        }
        res.status(200).type('application/json').send(note)
      })
      .catch(err => {
        return res.status(500).send(err.message)
      })
  })

  app.post('/notes', (req, res) => {
    const id = Date.now()
    const { title, content } = req.body

    db.run(`INSERT INTO notes (title, content) values("${title}", "${content}")`)
      .then(data => {
        res.send(200, data.lastID)
        // res.sendStatus(200).send(data.lastID)
      })
      .catch(err => {
        console.log(err)
        if (err && err.errno == 19) {
          return res.send(400, 'This title already exists')
        }
        return res.status(400).send(err.message)
      });
  })

  app.put('/notes/:id', (req, res) => {
    const { id } = req.params
    const { title, content } = req.body

    if (!title && !content) {
      res.status(400).send('Pls provide data to update!')
    }

    db.get(`SELECT content, title, id FROM notes WHERE id=${id}`)
    .then(note => {
      if (!note) {
        return res.status(400).send('Note with such ID not found!')
      }

      const fields = [];
      if(title) {
        fields.push(`title="${title}"`)
      }
      if(content) {
        fields.push(`content="${content}"`)
      }
  
      db.run(`UPDATE notes SET ${fields.join(',')} WHERE id="${id}"`)
      .then(data => {
        console.log(data);
        res.send(204);
      })
      .catch(err => {
        console.log(err);
        return res.status(400).send(err.message);
      })
    })
    .catch(err => {
      return res.status(500).send(err.message)
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
