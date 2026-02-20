const User = require("../../models/User");
const bcrypt = require("bcryptjs");


// ✅ Create Valuer
exports.createValuer = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      ...req.body,
      password: hashedPassword,
      role: "valuer"
    });

res.status(201).json({
  id: user._id,
  name: user.name,
  email: user.email,
  mobile: user.mobile,
  role: user.role
});

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// ✅ Get All Valuers
exports.getValuers = async (req, res) => {
  try {
    const valuers = await User.find({ role: "valuer" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(valuers);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get Single Valuer
exports.getValuerById = async (req, res) => {
  try {
    const valuer = await User.findOne({
      _id: req.params.id,
      role: "valuer"
    }).select("-password");

    if (!valuer) {
      return res.status(404).json({ message: "Valuer not found" });
    }

    res.json(valuer);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Update Valuer
exports.updateValuer = async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const valuer = await User.findOneAndUpdate(
      { _id: req.params.id, role: "valuer" },
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    if (!valuer) {
      return res.status(404).json({ message: "Valuer not found" });
    }

    res.json(valuer);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// ✅ Delete Valuer
exports.deleteValuer = async (req, res) => {
  try {
    const valuer = await User.findOneAndDelete({
      _id: req.params.id,
      role: "valuer"
    });

    if (!valuer) {
      return res.status(404).json({ message: "Valuer not found" });
    }

    res.json({ message: "Valuer deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
