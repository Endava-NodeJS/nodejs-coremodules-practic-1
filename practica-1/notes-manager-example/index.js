const fs = require('fs');

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/notes', (req, res) => {
  fs.readFile('./data.json', 'utf8' , (err, data) => {
    if (err) {
      return res.send(err.message);
    }
    res.send(data);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

