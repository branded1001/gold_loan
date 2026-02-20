const router = require("express").Router();
const invoiceController = require("../../controllers/admin/InvoiceController.js");
const { auth, isAdmin } = require("../../middleware/auth.middleware.js");

// Admin only
router.post("/generate", auth, isAdmin, invoiceController.generateInvoice);

router.get("/", auth, isAdmin, invoiceController.getInvoices);

router.get("/:id", auth, isAdmin, invoiceController.getInvoiceById);

router.get("/:id/details", auth, isAdmin, invoiceController.getInvoiceDetails);

router.put("/:id", auth, isAdmin, invoiceController.updateInvoice);

router.delete("/:id", auth, isAdmin, invoiceController.deleteInvoice);

module.exports = router;
