const express = require("express");

const {
  webhook,
  setDefault,
  cancelRequest,
  checkOutSession,
  getSubscriptionHistory,
  getSubscriptionInvoice,
} = require("../../controllers/subscription");

const { ensureAuth } = require("../../middleware/ensure-auth");

const app = express.Router();

app.post("/create-checkout-session", ensureAuth, checkOutSession);
app.put("/set-default-cancel", setDefault);
app.post("/webhook", webhook);
app.post("/cancel-request", ensureAuth, cancelRequest);
app.get("/history", ensureAuth, getSubscriptionHistory);
app.get("/invoice", ensureAuth, getSubscriptionInvoice);

module.exports = app;
