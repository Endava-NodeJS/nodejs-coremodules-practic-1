const fs = require('fs')
const util = require('util')

const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const port = 3000

app.get('/', (req, res) => {
  // res.send(200)
  res.send('Hello World!')
})

app.get('/notes', (req, res) => {
  const result = fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) {
      return res.send(err.message)
    }

    res.send(data)
  })
})

// add data from req body
app.post('/notes', (req, res) => {
  const { title, content } = req.body
  fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err)
      return res.send(err.message)
    }
    const parsedNotes = JSON.parse(data)
    let newContent = JSON.stringify([...parsedNotes, { title, content }])

    fs.writeFile('./data.json', newContent, { flag: 'w' }, (err) => {
      if (err) {
        console.log(err)
        return res.send(err.message)
      }
      console.log('some data to notes file', newContent)
      res.send(newContent)
      res.status(201).send('New note added!')
    })
  })
})

// add note using util promisify
app.post('/notes-promisify', (req, res) => {
  const { title, content } = req.body
  const fsReadFileAsync = util.promisify(fs.readFile)
  const fsWriteFileAsync = util.promisify(fs.writeFile)

  fsReadFileAsync('./data.json', 'utf8')
    .then((data) => {
      const parsedNotes = JSON.parse(data)
      // throw new Error('New error !')
      let newContent = JSON.stringify([...parsedNotes, { title, content }])
      fsWriteFileAsync('./data.json', newContent, { flag: 'w' })
        .then(() => {
          res.send(newContent)
          res.status(201).send('New note added!')
        })
        .catch((err) => {
          console.log(err)
          return res.send(err.message)
        })
    })
    .catch((err) => {
      console.log(err)
      // mandatory to return res to user
      return res.send(err.message)
    })
})

// add note using Promise
app.post('/notes-promisify-2', (req, res) => {
  const { title, content } = req.body
  const fsReadFileAsync = (file, encoding) =>
    new Promise((resolve, reject) => {
      fs.readFile(file, encoding, (err, data) => {
        if (err) {
          return reject(err)
        }
        resolve(data)
      })
    })

  const fsWriteFileAsync = (file, newContent, options) =>
    new Promise((resolve, reject) => {
      fs.writeFile(file, newContent, options, (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })

  fsReadFileAsync('./data.json', 'utf8')
    .then((data) => {
      const parsedNotes = JSON.parse(data)
      // throw new Error('New error !')
      let newContent = JSON.stringify([...parsedNotes, { title, content }])
      fsWriteFileAsync('./data.json', newContent, { flag: 'w' })
        .then(() => {
          res.send(newContent)
          res.status(201).send('New note added!')
        })
        .catch((err) => {
          console.log(err)
          return res.send(err.message)
        })
    })
    .catch((err) => {
      console.log(err)
      // mandatory to return res to user
      return res.send(err.message)
    })
})

// find a note by title
app.get('/notes/:title', (req, res) => {
  const { title } = req.params

  const notesFromFile = fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) {
      return res.send(err.message)
    }
    const parsedNotes = JSON.parse(data)
    const note = parsedNotes.find((note) => note.title === title)
    if (note) res.status(200).send(note)
    else res.status(400).send('Note not found')
  })
})

// delete a note by id using DELETE method
app.delete('/notes/delete/:id', (req, res) => {
  const { id } = req.params

  fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err)
      return res.send(err.message)
    }

    const parsedNotes = JSON.parse(data)
    const noteId = parsedNotes.find((note) => note.title === id)

    if (noteId) {
      const filteredData = parsedNotes.filter((value) => {
        return value !== noteId
      })

      let newContent = JSON.stringify(filteredData)

      fs.writeFile('./data1.json', newContent, (err) => {
        if (err) {
          console.log(err)
          return res.send(err.message)
        }
      })
      res.status(200).send(filteredData)
    } else return res.status(400).send('Note not found')
  })
})

// edit a note using PUT method

app.put('/notes/update/:id', (req, res) => {
  const { id } = req.params
  const { title, content } = req.body

  if (!title || !content) {
    res.status(400).send('Provide data to update')
  }

  fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err)
      return res.send(err.message)
    }

    const parsedNotes = JSON.parse(data)
    const noteId = parsedNotes.find((note) => note.title === id)

    if (noteId) {
      let newContent = JSON.stringify([...parsedNotes, { title, content }])

      fs.writeFile('./data2.json', newContent, (err) => {
        if (err) {
          console.log(err)
          return res.send(err.message)
        }
        res.status(200).send(newContent)
      })
    } else return res.status(400).send('Note not found')
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
