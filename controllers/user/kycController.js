const ValuerKyc = require("../../models/ValuerKyc");

// Helper BASE URL
const getBaseUrl = () => {
  return process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
};

// ==============================
// Submit KYC (Valuer)
// ==============================
exports.submitKyc = async (req, res) => {
  try {
    const existing = await ValuerKyc.findOne({ user: req.user.id });

    if (existing) {
      return res.status(400).json({
        message: "KYC already submitted",
      });
    }

    if (!req.files || req.files.length !== 3) {
      return res.status(400).json({
        message: "Please upload 3 documents",
      });
    }

    const docs = req.files.map(
      (file) => `/uploads/attendance/${file.filename}`
    );

    const kyc = await ValuerKyc.create({
      user: req.user.id,
      name: req.body.name,
      mobile: req.body.mobile,
      email: req.body.email,
      document1: docs[0],
      document2: docs[1],
      document3: docs[2],
    });

    res.status(201).json({
      success: true,
      message: "KYC submitted successfully",
      data: kyc,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};