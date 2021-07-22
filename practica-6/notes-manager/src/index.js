const express = require("express");
const apiRoutes = require("./routes");
const connect = require("./db");

const port = 5000;
const app = express();

app.use(express.json());
app.use(express.static("public"));

connect()
  .then((db) => {
    console.log("Connected to DB successfully!");
    apiRoutes(app, db);

    app.listen(port, () =>
      console.log(`Express started on http://localhost:${port};`)
    );
  })
  .catch((err) => {
    console.log("Couldn't connect to DB", err);
  });
