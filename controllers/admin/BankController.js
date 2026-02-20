const Bank = require("../../models/Bank.js");

// Helper for BASE_URL
const getBaseUrl = () => {
  return (
    process.env.BASE_URL ||
    `http://localhost:${process.env.PORT || 5002}`
  );
};

// ==============================
// CREATE BANK
// ==============================
exports.createBank = async (req, res) => {
  try {

    const imagePath = req.file
      ? `/uploads/attendance/${req.file.filename}`
      : null;

    const bank = await Bank.create({
      ...req.body,
      image: imagePath
    });
    
    res.status(201).json({
      success: true,
      data: bank
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ==============================
// GET ALL BANKS
// ==============================
exports.getBanks = async (req, res) => {
  try {

    const BASE_URL = getBaseUrl();

    const banks = await Bank.find().sort({ createdAt: -1 });

    const formattedData = banks.map((item) => ({
      _id: item._id,
      name: item.name,
      code: item.code,
      address: item.address,
      contactEmail: item.contactEmail,
      contactPhone: item.contactPhone,
      isActive: item.isActive,
      image: item.image ? `${BASE_URL}${item.image}` : null,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==============================
// GET SINGLE BANK
// ==============================
exports.getBankById = async (req, res) => {
  try {

    const BASE_URL = getBaseUrl();

    const bank = await Bank.findById(req.params.id);

    if (!bank) {
      return res.status(404).json({ message: "Bank not found" });
    }

    const formattedData = {
      _id: bank._id,
      name: bank.name,
      code: bank.code,
      address: bank.address,
      contactEmail: bank.contactEmail,
      contactPhone: bank.contactPhone,
      isActive: bank.isActive,
      image: bank.image ? `${BASE_URL}${bank.image}` : null,
      createdAt: bank.createdAt,
      updatedAt: bank.updatedAt
    };

    res.status(200).json({
      success: true,
      data: formattedData
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==============================
// UPDATE BANK
// ==============================
exports.updateBank = async (req, res) => {
  try {

    const bank = await Bank.findById(req.params.id);

    if (!bank) {
      return res.status(404).json({ message: "Bank not found" });
    }

    // If new image uploaded
    if (req.file) {
      bank.image = `/uploads/attendance/${req.file.filename}`;
    }

    // Update other fields
    Object.assign(bank, req.body);

    await bank.save();

    res.status(200).json({
      success: true,
      message: "Bank updated successfully",
      data: bank
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ==============================
// DELETE BANK
// ==============================
exports.deleteBank = async (req, res) => {
  try {

    const bank = await Bank.findByIdAndDelete(req.params.id);

    if (!bank) {
      return res.status(404).json({ message: "Bank not found" });
    }

    res.status(200).json({
      success: true,
      message: "Bank deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};