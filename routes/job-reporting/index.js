const express = require("express");

const { ensureAuth } = require("../../middleware/ensure-auth");
const { addjobReport } = require("../../controllers/job-reporting");

const app = express.Router();

app.post("/report-job", ensureAuth, addjobReport);

module.exports = app;
