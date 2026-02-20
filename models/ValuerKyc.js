const mongoose = require("mongoose");

const ValuerKycSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, 
    },

    name: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    document1: {
      type: String,
      required: true,
    },

    document2: {
      type: String,
      required: true,
    },

    document3: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ValuerKyc", ValuerKycSchema);