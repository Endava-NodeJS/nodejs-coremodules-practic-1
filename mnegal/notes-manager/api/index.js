const fs = require('fs');

const fileName = './notes.json';

module.exports = app => {
  app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
  });

  app.get('/notes', (req, res) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        return res.status(400).send(err.message);
      }
      res.status(200).type('application/json').send(data);
    });
  });

  app.post('/add', (req, res) => {
    const id = Date.now();
    const body = { id, ...req.body };

    fs.readFile(fileName, (err, data) => {
      const notes = JSON.parse(data);
      notes[id] = body;

      fs.writeFile(fileName, JSON.stringify(notes), err => {
        if (err) {
          return res.status(400).send(err.message);
        }
        res.status(200).type('application/json').send(body);
      });
    });
  });

  app.put('/edit', (req, res) => {
    const { body } = req;

    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        return res.status(400).send(err.message);
      }

      const notes = JSON.parse(data);
      if (!notes[body.id]) {
        return res.status(400).send('Note with such ID not found!');
      }

      notes[body.id] = body;

      fs.writeFile(fileName, JSON.stringify(notes), err => {
        if (err) {
          return res.status(400).send(err.message);
        }
        res.status(200).type('application/json').send(body);
      });
    });
  });
};
