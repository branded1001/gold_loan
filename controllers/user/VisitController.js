const Visit = require("../../models/Visit");
const Bank = require("../../models/Bank");
const Branch = require("../../models/Branch");
const Region = require("../../models/Region");


/* =====================================================
     DATA (BANK, REGION, BRANCH)
===================================================== */

exports.getMasterData = async (req, res) => {
  try {

    // Fetch all in parallel (fastest way)
    const [banks, regions, branches] = await Promise.all([
      Bank.find().sort({ bank_name: 1 }),
      Region.find().sort({ region_name: 1 }),
      Branch.find()
        .populate("region_id", "region_name")
        .populate("bank_id", "bank_name")
        .sort({ branch_name: 1 })
    ]);

    res.status(200).json({
      success: true,
      banks,
      regions,
      branches
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* =====================================================
    CREATE VISIT (USER)
===================================================== */

exports.createVisit = async (req, res) => {
  try {

    const {
      bank_id,
      branch_id,
      region_id,
      branch_code,
      visit_date,
      customer_name
    } = req.body;

    const visit = await Visit.create({
      emp_id: req.user.id,
      bank_id,
      branch_id,
      region_id,
      branch_code,
      visit_date,
      customer_name,
      status: "ASSIGNED"
    });

    res.status(201).json({
      success: true,
      message: "Visit created successfully",
      visit
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



/* =====================================================
   MY VISITS (HISTORY)
===================================================== */

exports.myVisits = async (req, res) => {
  try {

    const visits = await Visit.find({ emp_id: req.user.id })
      .populate("bank_id", "bank_name")
      .populate("branch_id", "branch_name branch_code")
      .populate("region_id", "region_name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: visits.length,
      visits
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* =====================================================
   ✅ START VISIT
===================================================== */

exports.startVisit = async (req, res) => {
  try {

    const visit = await Visit.findOne({
      _id: req.params.id,
      emp_id: req.user.id
    });

    if (!visit) {
      return res.status(404).json({
        message: "Visit not found or not assigned to you"
      });
    }

    if (visit.status !== "ASSIGNED") {
      return res.status(400).json({
        message: "Visit already started or completed"
      });
    }

    visit.status = "IN_PROGRESS";
    visit.time_in = new Date();

    await visit.save();

    res.status(200).json({
      success: true,
      message: "Visit started successfully",
      visit
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* =====================================================
   ✅ NO CUSTOMER
===================================================== */

exports.noCustomer = async (req, res) => {
  try {

    const visit = await Visit.findOne({
      _id: req.params.id,
      emp_id: req.user.id
    });

    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    if (visit.status !== "IN_PROGRESS") {
      return res.status(400).json({
        message: "Visit must be in progress"
      });
    }

    visit.status = "NO_CUSTOMER";
    visit.time_out = new Date();

    await visit.save();

    res.status(200).json({
      success: true,
      message: "Marked as No Customer",
      visit
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* =====================================================
   ✅ END VISIT (IMAGE OPTIONAL)
===================================================== */

exports.endVisit = async (req, res) => {
  try {

    const visit = await Visit.findOne({
      _id: req.params.id,
      emp_id: req.user.id
    });

    if (!visit) {
      return res.status(404).json({
        message: "Visit not found or not assigned to you"
      });
    }

    if (visit.status !== "IN_PROGRESS") {
      return res.status(400).json({
        message: "Visit is not in progress"
      });
    }

    visit.status = "COMPLETED";
    visit.time_out = new Date();

    //  IMAGE SAVE (if uploaded)
    if (req.file) {
      visit.image = `/uploads/attendance/${req.file.filename}`;
    }

    await visit.save();

    res.status(200).json({
      success: true,
      message: "Visit completed successfully",
      visit
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
