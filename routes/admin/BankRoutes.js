const router = require("express").Router();
const bankController = require("../../controllers/admin/BankController.js");
const { auth, isAdmin } = require("../../middleware/auth.middleware.js");
const upload = require("../../middleware/upload.js"); 

// All routes admin only
router.post("/", auth, isAdmin, upload.single("image"), bankController.createBank);
router.get("/", auth, isAdmin, bankController.getBanks);
router.get("/:id", auth, isAdmin, bankController.getBankById);
router.put("/:id", auth, isAdmin, upload.single("image"), bankController.updateBank);
router.delete("/:id", auth, isAdmin, bankController.deleteBank);

module.exports = router;
