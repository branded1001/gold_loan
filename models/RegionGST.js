// src/models/RegionGST.js
const mongoose = require("mongoose");

const RegionGSTSchema = new mongoose.Schema({
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

  gst_no: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },

  effective_from: {
    type: Date,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });


// ✅ Prevent duplicate GST for same region + effective date
RegionGSTSchema.index(
  { region_id: 1, effective_from: 1 },
  { unique: true }
);

module.exports = mongoose.model("RegionGST", RegionGSTSchema);
