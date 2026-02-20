const mongoose = require("mongoose");
const Invoice = require("../../models/Invoice");
const InvoiceVisit = require("../../models/InvoiceVisit");
const Visit = require("../../models/Visit");
const Region = require("../../models/Region");
const RegionGST = require("../../models/RegionGST");


// =====================================================
// ✅ GENERATE INVOICE (PRODUCTION READY - OPTIMIZED)
// =====================================================
exports.generateInvoice = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bank_id, region_id, invoice_month, invoice_year } = req.body;

    if (!bank_id || !region_id || !invoice_month || !invoice_year) {
      return res.status(400).json({
        message: "bank_id, region_id, invoice_month and invoice_year are required"
      });
    }

    // 🔒 DUPLICATE CHECK
    const existingInvoice = await Invoice.findOne({
      bank_id,
      region_id,
      invoice_month,
      invoice_year
    });

    if (existingInvoice) {
      return res.status(400).json({
        message: "Invoice already generated for this bank & region & month"
      });
    }

    // 🔎 REGION VALIDATION
    const region = await Region.findById(region_id);
    if (!region) {
      return res.status(404).json({ message: "Region not found" });
    }

    const { per_visit_rate, gst_percent } = region;

    if (!per_visit_rate) {
      return res.status(400).json({
        message: "Per visit rate not configured in region"
      });
    }

    // 🔎 GST VALIDATION
    const regionGST = await RegionGST.findOne({
      region_id,
      isActive: true
    });

    if (!regionGST) {
      return res.status(400).json({
        message: "Active GST not configured for this region"
      });
    }

    const gst_no = regionGST.gst_no;

    // 📅 DATE RANGE
    const startDate = new Date(invoice_year, invoice_month - 1, 1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(invoice_year, invoice_month, 0);
    endDate.setHours(23, 59, 59, 999);

    // =====================================================
    // ✅ AGGREGATION BASED VISIT FETCH (FAST & SAFE)
    // =====================================================
    const visits = await Visit.aggregate([
      {
        $match: {
          bank_id: new mongoose.Types.ObjectId(bank_id),
          region_id: new mongoose.Types.ObjectId(region_id),
          status: "COMPLETED",
          visit_date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $project: {
          _id: 1,
          branch_id: 1
        }
      }
    ]);

    if (!visits.length) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "No completed visits found for this month"
      });
    }

    const total_visits = visits.length;

    // 💰 CALCULATIONS
    const base_amount = total_visits * per_visit_rate;
    const gst_amount = (base_amount * gst_percent) / 100;
    const total_amount = base_amount + gst_amount;

    // 🧾 CREATE INVOICE
    const invoice = await Invoice.create([{
      bank_id,
      region_id,
      invoice_number: `INV-${invoice_year}-${invoice_month}-${Date.now()}`,
      invoice_month,
      invoice_year,
      gst_no,
      per_visit_rate,
      gst_percent,
      total_visits,
      base_amount,
      gst_amount,
      total_amount,
      status: "GENERATED",
      generated_at: new Date()
    }], { session });

    const createdInvoice = invoice[0];

    // 🔗 MAP VISITS
    const invoiceVisitData = visits.map(v => ({
      invoice_id: createdInvoice._id,
      visit_id: v._id,
      branch_id: v.branch_id
    }));

    await InvoiceVisit.insertMany(invoiceVisitData, { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Invoice generated successfully",
      invoice: createdInvoice
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      message: error.message
    });
  }
};



// =====================================================
// ✅ GET ALL INVOICES
// =====================================================
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("bank_id", "bank_name")
      .populate("region_id", "region_name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: invoices.length,
      invoices
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =====================================================
// ✅ GET SINGLE INVOICE
// =====================================================
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("bank_id", "bank_name")
      .populate("region_id", "region_name");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({
      success: true,
      invoice
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// =====================================================
// ✅ GET INVOICE DETAILS WITH VISITS
// =====================================================
exports.getInvoiceDetails = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("bank_id", "bank_name")
      .populate("region_id", "region_name");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const visits = await InvoiceVisit.find({ invoice_id: invoice._id })
      .populate({
        path: "visit_id",
        populate: [
          { path: "emp_id", select: "name email" },
          { path: "branch_id", select: "branch_name branch_code" }
        ]
      });

    res.status(200).json({
      success: true,
      invoice,
      visits
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// =====================================================
// ✅ UPDATE INVOICE
// =====================================================
exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      invoice
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



// =====================================================
// ✅ DELETE INVOICE
// =====================================================
exports.deleteInvoice = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    await InvoiceVisit.deleteMany(
      { invoice_id: invoice._id },
      { session }
    );

    await Invoice.deleteOne(
      { _id: invoice._id },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully"
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};
