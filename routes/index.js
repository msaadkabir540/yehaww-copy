require("express-async-errors");
const express = require("express");
const { error } = require("../middleware/error");
const app = express.Router();

app.use("/auth", require("./auth"));
app.use("/candidate", require("./candidate"));
app.use("/employer", require("./employer"));
app.use("/job", require("./job"));
app.use("/job-draft", require("./job-draft"));
app.use("/dashboard", require("./dashboard"));
app.use("/mailing-list", require("./mailing-list"));
app.use("/advertisers", require("./advertisers"));
app.use("/subscription", require("./subscription"));
app.use("/job-reporting", require("./job-reporting"));
app.use("/utils", require("./utils"));

app.use(error);

module.exports = app;
