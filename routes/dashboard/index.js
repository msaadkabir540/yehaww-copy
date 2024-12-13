const express = require("express");
const app = express.Router();
const { dashboardData } = require("../../controllers/dashboard");

app.get("/", dashboardData);

module.exports = app;
