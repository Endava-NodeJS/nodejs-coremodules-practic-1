const express = require('express')
const apiRoutes = require('./routes')

const port = 5000
const app = express()

app.use(express.json())

apiRoutes(app)

app.listen(port, () =>
  console.log(`Express started on http://localhost:${port};`)
)
