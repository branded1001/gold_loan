// src/models/Bank.js
const mongoose = require("mongoose");

const BankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    unique: true,
    required: true
  },
  address: String,
  contactEmail: String,
  contactPhone: String,
   image: {
    type: String 
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Bank", BankSchema);