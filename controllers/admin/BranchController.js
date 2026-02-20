const Branch = require("../../models/Branch.js");

// ✅ Create Branch
exports.createBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json(branch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get All Branches (Optional filter by region)
exports.getBranches = async (req, res) => {
  try {
    const filter = {};

    if (req.query.region_id) {
      filter.region_id = req.query.region_id;
    }

    if (req.query.bank_id) {
      filter.bank_id = req.query.bank_id;
    }

    const branches = await Branch.find(filter)
      .populate("bank_id", "name")
      .populate("region_id", "name")
      .sort({ createdAt: -1 });

    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Single Branch
exports.getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id)
      .populate("bank_id", "name")
      .populate("region_id", "name");

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Branch
exports.updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.json(branch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete Branch
exports.deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.json({ message: "Branch deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
