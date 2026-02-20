const Bank = require("../../models/Bank");
const Region = require("../../models/Region");
const Branch = require("../../models/Branch");
const User = require("../../models/User");
const Visit = require("../../models/Visit");
const Invoice = require("../../models/Invoice");

exports.getAdminDashboard = async (req, res) => {
  try {

    // ===== Basic Counts =====
    const totalBanks = await Bank.countDocuments();
    const totalRegions = await Region.countDocuments();
    const totalBranches = await Branch.countDocuments();
    const totalUsers = await User.countDocuments();

    // ===== Visit Stats =====
    const totalVisits = await Visit.countDocuments();
    const completedVisits = await Visit.countDocuments({ status: "COMPLETED" });
    const pendingVisits = await Visit.countDocuments({ status: "PENDING" });

    // ===== Invoice Stats =====
    const totalInvoices = await Invoice.countDocuments();
    const paidInvoices = await Invoice.countDocuments({ status: "PAID" });

    // ===== Revenue =====
    const revenueData = await Invoice.aggregate([
      { $match: { status: { $in: ["GENERATED", "PAID"] } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total_amount" }
        }
      }
    ]);

    const totalRevenue = revenueData.length > 0
      ? revenueData[0].totalRevenue
      : 0;

    res.json({
      summary: {
        totalBanks,
        totalRegions,
        totalBranches,
        totalUsers,
        totalVisits,
        completedVisits,
        pendingVisits,
        totalInvoices,
        paidInvoices,
        totalRevenue
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
