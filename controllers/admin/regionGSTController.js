const RegionGST = require("../../models/RegionGST.js");


// ============================
// ✅ CREATE / ADD GST
// ============================
exports.createRegionGST = async (req, res) => {
  try {
    const { bank_id, region_id, gst_no, effective_from } = req.body;

    // Optional: deactivate old GST if needed
    await RegionGST.updateMany(
      { region_id },
      { $set: { isActive: false } }
    );

    const regionGST = await RegionGST.create({
      bank_id,
      region_id,
      gst_no,
      effective_from,
      isActive: true
    });

    res.status(201).json(regionGST);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// ============================
// ✅ GET ALL GST (Optional filter)
// ============================
exports.getRegionGSTs = async (req, res) => {
  try {
    const filter = {};

    if (req.query.region_id) {
      filter.region_id = req.query.region_id;
    }

    const data = await RegionGST.find(filter)
      .populate("bank_id", "name")
      .populate("region_id", "name code")
      .sort({ effective_from: -1 });

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ============================
// ✅ GET ACTIVE GST BY REGION
// ============================
exports.getActiveGSTByRegion = async (req, res) => {
  try {
    const regionGST = await RegionGST.findOne({
      region_id: req.params.region_id,
      isActive: true
    });

    if (!regionGST) {
      return res.status(404).json({
        message: "Active GST not found for this region"
      });
    }

    res.json(regionGST);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ============================
// ✅ UPDATE GST
// ============================
exports.updateRegionGST = async (req, res) => {
  try {
    const regionGST = await RegionGST.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!regionGST) {
      return res.status(404).json({ message: "GST record not found" });
    }

    res.json(regionGST);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// ============================
// ✅ DELETE GST
// ============================
exports.deleteRegionGST = async (req, res) => {
  try {
    const regionGST = await RegionGST.findByIdAndDelete(req.params.id);

    if (!regionGST) {
      return res.status(404).json({ message: "GST record not found" });
    }

    res.json({ message: "GST deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
