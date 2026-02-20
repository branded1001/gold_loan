// src/models/Invoice.js
const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  bank_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bank",
    required: true,
    index: true
  },

  region_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region",
    required: true,
    index: true
  },

  invoice_number: {
    type: String,
    unique: true,
    required: true
  },

  invoice_month: {
    type: Number,
    min: 1,
    max: 12,
    required: true
  },

  invoice_year: {
    type: Number,
    required: true
  },

  gst_no: {
    type: String,
    required: true,
    uppercase: true
  },

  // ---- Snapshot Pricing (VERY IMPORTANT) ----
  per_visit_rate: {
    type: Number,
    required: true,
    min: 0
  },

  gst_percent: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },

  // ---- Visit Summary ----
  total_visits: {
    type: Number,
    default: 0,
    min: 0
  },

  // ---- Amounts ----
  base_amount: {
    type: Number,
    default: 0,
    min: 0
  },

  gst_amount: {
    type: Number,
    default: 0,
    min: 0
  },

  total_amount: {
    type: Number,
    default: 0,
    min: 0
  },

  // ---- Status ----
  status: {
    type: String,
    enum: ["DRAFT", "GENERATED", "SENT", "PAID"],
    default: "DRAFT"
  },

  generated_at: {
    type: Date
  },

  due_date: {
    type: Date
  }

}, { timestamps: true });


// ✅ Prevent duplicate invoice per region per month
InvoiceSchema.index(
  { bank_id: 1, region_id: 1, invoice_month: 1, invoice_year: 1 },
  { unique: true }
);

module.exports = mongoose.model("Invoice", InvoiceSchema);
