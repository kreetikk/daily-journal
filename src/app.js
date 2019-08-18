const express = require("express");
const bodyParser = require("body-parser");
const journalRoute = require("./journal-route");

const app = express();

app.use(bodyParser.json());
app.use("/journal", journalRoute);

module.exports = app;