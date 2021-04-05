const fs = require('fs')

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

app.get('/notes', (req, res) => {
  const data = JSON.parse(fs.readFile('./data.json'))
  const dataToAdd = { title: 'Title3', content: 'Content 3' }
  let newContent = JSON.stringify([...data, { title, content }])
  fs.writeFile('./data.json', newContent, { flag: 'a+' }, (err) => {
    if (err) {
      return console.log(error)
    }
    console.log('added some data to notes file', content)
    res.send(content)
  })
})

// find a note by title
app.get('/notes/:title', (req, res) => {
  const notesFromFile = fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) {
      return res.send(err.message)
    }
    const parsedNotes = JSON.parse(data)
    const { title } = req.params
    const note = parsedNotes.find((note) => note.title === title)
    if (note) res.status(200).send(note)
    else res.status(400).send('Note not found')
  })
})

// add data from req body
app.post('/notes', (req, res) => {
  const content = req.body
  fs.writeFile('./data.json', content, { flag: 'a+' }, (err) => {
    if (err) {
      return console.log(error)
    }
    console.log('some data to notes file', content)
    res.send(content)
  })
  res.status(201).send('New note added!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
