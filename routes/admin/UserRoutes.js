const router = require("express").Router();
const valuerController = require("../../controllers/admin/UserController.js");
const { auth, isAdmin } = require("../../middleware/auth.middleware.js");

// Admin only
router.post("/", auth, isAdmin, valuerController.createValuer);
router.get("/", auth, isAdmin, valuerController.getValuers);
router.get("/:id", auth, isAdmin, valuerController.getValuerById);
router.put("/:id", auth, isAdmin, valuerController.updateValuer);
router.delete("/:id", auth, isAdmin, valuerController.deleteValuer);

module.exports = router;
