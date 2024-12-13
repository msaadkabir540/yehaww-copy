const express = require("express");

const { addMail, contactUs } = require("../../controllers/mailing-list");
const { Validator } = require("../../middleware/ensure-auth");
const { validateMail, validateContact } = require("./validate");

const app = express.Router();

app.post("/add", Validator(validateMail, "body"), addMail);
app.post("/contact-us", Validator(validateContact, "body"), contactUs);

module.exports = app;
