const Region = require("../../models/Region");
const Branch = require("../../models/Branch");
const Invoice = require("../../models/Invoice");


// ✅ Create Region
exports.createRegion = async (req, res) => {
  try {
    const { bank_id, name, code, per_visit_rate, gst_percent } = req.body;

    if (!bank_id || !name || !code) {
      return res.status(400).json({
        message: "bank_id, name and code are required"
      });
    }

    const region = await Region.create({
      bank_id,
      name,
      code,
      per_visit_rate,
      gst_percent
    });

    res.status(201).json(region);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Region code already exists for this bank"
      });
    }

    res.status(400).json({ message: error.message });
  }
};


// ✅ Get All Regions (Filter by bank & active)
exports.getRegions = async (req, res) => {
  try {
    const filter = {};

    if (req.query.bank_id) {
      filter.bank_id = req.query.bank_id;
    }

    if (req.query.active) {
      filter.isActive = req.query.active === "true";
    }

    const regions = await Region.find(filter)
      .populate("bank_id", "name")
      .sort({ createdAt: -1 });

    res.json(regions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get Single Region
exports.getRegionById = async (req, res) => {
  try {
    const region = await Region.findById(req.params.id)
      .populate("bank_id", "name");

    if (!region) {
      return res.status(404).json({ message: "Region not found" });
    }

    res.json(region);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Update Region (Rate change protected)
exports.updateRegion = async (req, res) => {
  try {
    const { per_visit_rate } = req.body;

    const region = await Region.findById(req.params.id);

    if (!region) {
      return res.status(404).json({ message: "Region not found" });
    }

    // 🔒 Prevent rate change if invoice exists
    if (per_visit_rate && per_visit_rate !== region.per_visit_rate) {
      const invoiceExists = await Invoice.findOne({
        region_id: req.params.id
      });

      if (invoiceExists) {
        return res.status(400).json({
          message: "Cannot change rate. Invoice already generated for this region."
        });
      }
    }

    const updatedRegion = await Region.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedRegion);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Region code already exists for this bank"
      });
    }

    res.status(400).json({ message: error.message });
  }
};


// ✅ Delete Region (Dependency Safe)
exports.deleteRegion = async (req, res) => {
  try {
    const region = await Region.findById(req.params.id);

    if (!region) {
      return res.status(404).json({ message: "Region not found" });
    }

    // 🔒 Check Branch Dependency
    const branchExists = await Branch.findOne({
      region_id: req.params.id
    });

    if (branchExists) {
      return res.status(400).json({
        message: "Cannot delete region. Branches exist under this region."
      });
    }

    // 🔒 Check Invoice Dependency
    const invoiceExists = await Invoice.findOne({
      region_id: req.params.id
    });

    if (invoiceExists) {
      return res.status(400).json({
        message: "Cannot delete region. Invoice already generated."
      });
    }

    await Region.findByIdAndDelete(req.params.id);

    res.json({ message: "Region deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
