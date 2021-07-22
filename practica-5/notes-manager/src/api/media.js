const fs = require('fs')
const path = require('path')
const utils = require('util')
const zlib = require('zlib')

const videoName = 'cats.mp4'
const videoPath = path.join(__dirname, '../../public/', videoName)
const fsStat = utils.promisify(fs.stat)
const toArchive = zlib.createGzip()

module.exports = (app) => {
  app.get('/video-download', (req, res) => {
    fsStat(videoPath)
      .then((fileStats) => {
        const file = fs.createReadStream(videoPath)

        // file.on('error', (error) => {
        //   console.log(error)
        // })

        res.attachment(videoName)

        file.pipe(res)
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send(err.message)
      })
  })

  app.get('/video', (req, res) => {
    res.download(videoPath, videoName)
  })

  app.get('/video-archive', (req, res) => {
    fsStat(videoPath)
      .then((fileStats) => {
        const file = fs.createReadStream(videoPath)

        file.on('error', (error) => {
          console.log(error)
        })

        res.attachment('cats.zip')

        file.pipe(toArchive).pipe(res)
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send(err.message)
      })
  })
}
