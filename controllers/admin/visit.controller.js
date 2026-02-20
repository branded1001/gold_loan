const Visit = require("../../models/Visit");


exports.getAllVisits = async (req, res) => {
  try {

    const visits = await Visit.find()
      .populate("emp_id", "name email")
      .populate("bank_id", "name")
      .populate("branch_id", "branch_name branch_code")
      .populate("region_id", "region_name")
      .sort({ createdAt: -1 });

    // BASE URL
    const BASE_URL =
      process.env.BASE_URL ||
      `${req.protocol}://${req.get("host")}`;

    //  Format Data
    const formattedData = visits.map((item) => ({
      _id: item._id,

      employee_name: item.emp_id?.name || null,
      employee_email: item.emp_id?.email || null,

      bank: item.bank_id?.name || null,
      branch: item.branch_id?.branch_name || null,
      branch_code: item.branch_id?.branch_code || null,
      region: item.region_id?.region_name || null,

      visit_date: item.visit_date,
      customer_name: item.customer_name,

      time_in: item.time_in,
      time_out: item.time_out,

      status: item.status,

      //  Image Full URL
      image: item.image
        ? `${BASE_URL}${item.image}`
        : null,

      createdAt: item.createdAt
    }));
     
    res.status(200).json({
      success: true,
      total: formattedData.length,
      visits: formattedData
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





// Create Visit (Assign to Valuer)
// exports.createVisit = async (req, res) => {
//   try {
//     const visit = await Visit.create({
//       emp_id: req.body.emp_id,
//       branch_id: req.body.branch_id,
//       branch_code: req.body.branch_code,
//       visit_date: req.body.visit_date,
//       customer_name: req.body.customer_name,
//       status: "ASSIGNED"
//     });

//     res.status(201).json(visit);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// Get All Visits (Admin)


// // Cancel Visit (Admin)
// exports.cancelVisit = async (req, res) => {
//   try {
//     const visit = await Visit.findById(req.params.id);

//     if (!visit) {
//       return res.status(404).json({ message: "Visit not found" });
//     }

//     if (visit.status === "COMPLETED") {
//       return res.status(400).json({ message: "Completed visit cannot be cancelled" });
//     }

//     visit.status = "CANCELLED";
//     await visit.save();

//     res.json({ message: "Visit cancelled successfully", visit });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Delete Visit (Optional)
// exports.deleteVisit = async (req, res) => {
//   try {
//     await Visit.findByIdAndDelete(req.params.id);
//     res.json({ message: "Visit deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
