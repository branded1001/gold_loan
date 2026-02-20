const ValuerKyc = require("../../models/ValuerKyc");

const getBaseUrl = () => {
  return process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
};

// Get All KYC (Admin)
exports.getAllKyc = async (req, res) => {
  try {
    const BASE_URL = getBaseUrl();

    const kycs = await ValuerKyc.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const formatted = kycs.map((item) => ({
      _id: item._id,
      user: item.user,
      name: item.name,
      mobile: item.mobile,
      email: item.email,
      status: item.status,
      document1: `${BASE_URL}${item.document1}`,
      document2: `${BASE_URL}${item.document2}`,
      document3: `${BASE_URL}${item.document3}`,
      createdAt: item.createdAt,
    }));

    res.json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve / Reject KYC
exports.updateKycStatus = async (req, res) => {
  try {
    const kyc = await ValuerKyc.findById(req.params.id);

    if (!kyc) {
      return res.status(404).json({ message: "KYC not found" });
    }

    kyc.status = req.body.status;
    kyc.remarks = req.body.remarks || "";

    await kyc.save();

    res.json({
      success: true,
      message: "KYC status updated",
      data: kyc,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};