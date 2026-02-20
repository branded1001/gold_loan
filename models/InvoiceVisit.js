// src/models/InvoiceVisit.js
const mongoose = require("mongoose");

const InvoiceVisitSchema = new mongoose.Schema({
  invoice_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    required: true
  },

  visit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Visit",
    required: true
  },

  branch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("InvoiceVisit", InvoiceVisitSchema);