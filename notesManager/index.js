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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
