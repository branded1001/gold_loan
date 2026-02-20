// src/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: String,
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "valuer", "user"],
    default: "user"
  },
 otp: {
  type: String
},
otpExpire: {
  type: Date
},
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);