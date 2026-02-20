// models/Attendance.js
const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  emp_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  date: { type: Date, required: true },

  check_in_time: Date,
check_out_time: Date,


  check_in_lat: Number,
  check_in_long: Number,

 check_out_image: {
  type: String
},
check_out_lat: Number,
check_out_long: Number,

  image: {
    type: String 
  },

  status: {
    type: String,
    enum: ["PRESENT", "ABSENT", "HALF_DAY"],
    default: "PRESENT"
  }

}, { timestamps: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);