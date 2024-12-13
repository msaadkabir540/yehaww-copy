"use-strict";
const mongoose = require("mongoose");

const Subscription = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
  },
  canceled: {
    type: Boolean,
    default: false,
  },
  cancelRequested: {
    type: Boolean,
    default: false,
  },
  requestData: {
    date: Date,
    reason: String,
    feedback: String,
    alternative: String,
    status: { type: String, enum: ["Pending", "Canceled"] },
  },
  subscription_data: { type: mongoose.Schema.Types.Mixed },
});

module.exports = mongoose.model("subscription", Subscription);
