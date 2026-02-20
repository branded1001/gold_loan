const mongoose = require("mongoose");

const VisitSchema = new mongoose.Schema({
  emp_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  bank_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bank",
    required: true
  },

  branch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true
  },

  region_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region",
    required: true
  },

  branch_code: {
    type: String,
    required: true
  },

  visit_date: {
    type: Date,
    required: true
  },

  time_in: Date,
  time_out: Date,

  customer_name: {
    type: String,
    required: true
  },

  image: {
    type: String,   
    default: null
  },

  status: {
    type: String,
    enum: [
      "ASSIGNED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
      "NO_CUSTOMER"
    ],
    default: "ASSIGNED"
  }

}, { timestamps: true });

module.exports = mongoose.model("Visit", VisitSchema);
