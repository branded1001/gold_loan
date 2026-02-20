const mongoose = require("mongoose");
const Visit = require("../../models/Visit");
const Attendance = require("../../models/Attendance");


exports.getUserDashboard = async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);

    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const [
      totalVisits,
      completedVisits,
      pendingVisits,
      currentMonthVisits,
      currentMonthCompleted,
      totalAttendance
    ] = await Promise.all([

      Visit.countDocuments({ emp_id: userId }),

      Visit.countDocuments({
        emp_id: userId,
        status: "COMPLETED"
      }),

      Visit.countDocuments({
        emp_id: userId,
        status: "PENDING"
      }),

      Visit.countDocuments({
        emp_id: userId,
        visit_date: { $gte: startOfMonth, $lte: endOfMonth }
      }),

      Visit.countDocuments({
        emp_id: userId,
        status: "COMPLETED",
        visit_date: { $gte: startOfMonth, $lte: endOfMonth }
      }),

      Attendance.countDocuments({
        emp_id: userId,
      })

    ]);
    

    res.status(200).json({
      success: true,
      summary: {
        totalVisits,
        completedVisits,
        pendingVisits,
        currentMonthVisits,
        currentMonthCompleted,
        totalAttendance
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error("Error fetching user dashboard data:", error);
  }
};
