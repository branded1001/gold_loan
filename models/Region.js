// src/models/Region.js
const mongoose = require("mongoose");

const RegionSchema = new mongoose.Schema({
  bank_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bank",
    required: true,
    index: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },

  per_visit_rate: {
    type: Number,
    required: true,
    min: 0,
    default: 500
  },

  gst_percent: {
    type: Number,
    min: 0,
    max: 100,
    default: 18
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });


// ✅ Unique Region Code per Bank
RegionSchema.index({ bank_id: 1, code: 1 }, { unique: true });

module.exports = mongoose.model("Region", RegionSchema);
