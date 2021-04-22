const express = require('express');
const apiRoutes = require('./api');
const { connect } = require('./DBconfig');

const port = 5000;
const app = express();

app.use(express.json());
connect()
  .then(() => {
    apiRoutes(app);

    app.listen(port, () => console.log(`Express started on http://localhost:${port};`));
  })
  .catch(err => {
    console.log("Couldn't connect to DB", err);
  });
