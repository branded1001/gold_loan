
const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema({
  bank_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bank",
    required: true
  },
  region_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region",
    required: true
  },
  branch_name: {
    type: String,
    required: true
  },
  branch_code: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  city: String,
  state: String,
  pincode: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Branch", BranchSchema);