const router = require("express").Router();
const regionController = require("../../controllers/admin/RegionController.js");
const { auth, isAdmin } = require("../../middleware/auth.middleware.js");

// Admin only routes
router.post("/", auth, isAdmin, regionController.createRegion);
router.get("/", auth, isAdmin, regionController.getRegions);
router.get("/:id", auth, isAdmin, regionController.getRegionById);
router.put("/:id", auth, isAdmin, regionController.updateRegion);
router.delete("/:id", auth, isAdmin, regionController.deleteRegion);

module.exports = router;
