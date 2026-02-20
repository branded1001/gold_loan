const Attendance = require("../../models/Attendance");

// Check In
exports.checkIn = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 🔒 Check if already checked in today
    const existing = await Attendance.findOne({
      emp_id: req.user.id,
      date: { $gte: todayStart, $lte: todayEnd }
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already checked in today"
      });
    }

   const imagePath = req.file
  ? `/uploads/attendance/${req.file.filename}`
  : null;

const attendance = await Attendance.create({
  emp_id: req.user.id,
  date: new Date(),
  check_in_time: new Date(),
  check_in_lat: Number(req.body.lat),
  check_in_long: Number(req.body.long),
  image: imagePath,
  status: "PRESENT",
});
   return res.status(201).json({
  success: true,
  message: "Checked in successfully",
  data: attendance
});


  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check Out
exports.checkOut = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      emp_id: req.user.id,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "No check-in found today"
      });
    }

    // 🔒 Prevent multiple checkout
    if (attendance.check_out_time) {
      return res.status(400).json({
        success: false,
        message: "Already checked out today"
      });
    }

    // 🔥 Validate image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Checkout image is required"
      });
    }

    // 🔥 Validate location
    if (!req.body.lat || !req.body.long) {
      return res.status(400).json({
        success: false,
        message: "Location is required"
      });
    }

    attendance.check_out_time = new Date();
    attendance.check_out_lat = Number(req.body.lat);
    attendance.check_out_long = Number(req.body.long);

    // Full image URL (production ready)
    const imagePath = req.file
  ? `/uploads/attendance/${req.file.filename}`
  : null;

    attendance.check_out_image = imagePath;

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: "Checked out successfully",
      data: attendance
    });

  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};



// Get My Attendance
exports.myAttendance = async (req, res) => {
  try {
    const data = await Attendance.find({ emp_id: req.user.id }).sort({ date: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - Get All Attendance
exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("emp_id", "name email")
      .sort({ date: -1 });

   const BASE_URL =
  process.env.BASE_URL ||
  `http://localhost:${process.env.PORT}`;

const formattedData = attendance.map((item) => ({
  _id: item._id,
  emp_id: item.emp_id,
  date: item.date,
  check_in_time: item.check_in_time,
  check_out_time: item.check_out_time,
  check_in_lat: item.check_in_lat,
  check_in_long: item.check_in_long,
  check_out_lat: item.check_out_lat,
  check_out_long: item.check_out_long,
  status: item.status,

  check_in_image: item.image
    ? `${BASE_URL}${item.image}`
    : null,

  check_out_image: item.check_out_image
    ? `${BASE_URL}${item.check_out_image}`
    : null,
}));

res.status(200).json({
  success: true,
  count: formattedData.length,
  data: formattedData,
});
  } catch (error) {
    console.error("Get Attendance Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

