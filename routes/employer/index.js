const express = require("express");

const { personalDetails, settings } = require("../../controllers/employer");
const { ensureAuth, Validator } = require("../../middleware/ensure-auth");
const { validatePersonalDetails, validateSettings } = require("./validate");

const app = express.Router();

app.put(
  "/personalDetails",
  ensureAuth,
  Validator(validatePersonalDetails, "body"),
  personalDetails
);
app.put("/settings", ensureAuth, Validator(validateSettings, "body"), settings);

module.exports = app;
