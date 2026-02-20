const router = require("express").Router();
const { auth, isAdmin } = require("../../middleware/auth.middleware.js");
const kycController = require("../../controllers/admin/kycController.js");

router.get("/", auth, isAdmin, kycController.getAllKyc);

router.put("/:id", auth, isAdmin, kycController.updateKycStatus);

module.exports = router;