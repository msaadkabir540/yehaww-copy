const express = require("express");
const { getCities, downloadFile } = require("../../controllers/utils");

const app = express.Router();

app.get("/cities", getCities);
app.get("/download", downloadFile);

module.exports = app;
