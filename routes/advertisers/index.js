const express = require("express");

const { validateAdvertisers } = require("./validate");
const { Validator } = require("../../middleware/ensure-auth");
const { postAdvertisers } = require("../../controllers/advertiser");

const app = express.Router();

app.post("/", Validator(validateAdvertisers, "body"), postAdvertisers);

module.exports = app;
