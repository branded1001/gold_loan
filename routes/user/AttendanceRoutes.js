const router = require("express").Router();
const attendanceController = require("../../controllers/user/AttendanceController.js");
const upload = require("../../middleware/upload.js");
const { auth, isAdmin, isValuer } = require("../../middleware/auth.middleware.js");

// ✅ Valuer Check-In (Image required)
router.post(
  "/check-in",
  auth,
  isValuer,
  upload.single("image"),
  attendanceController.checkIn
);

// ✅ Valuer Check-Out
router.post(
  "/check-out",
  auth,
  isValuer,
  upload.single("image"),
  attendanceController.checkOut
);

// ✅ Valuer - Get Own Attendance
router.get(
  "/my",
  auth,
  isValuer,
  attendanceController.myAttendance
);

// ✅ Admin - Get All Attendance
router.get(
  "/all",
  auth,
  isAdmin,
  attendanceController.getAllAttendance
);

module.exports = router;
