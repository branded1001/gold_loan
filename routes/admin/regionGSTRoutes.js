const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/regionGSTController.js");

// Create
router.post("/", controller.createRegionGST);

// Get all
router.get("/", controller.getRegionGSTs);

// Get active by region
router.get("/active/:region_id", controller.getActiveGSTByRegion);

// Update
router.put("/:id", controller.updateRegionGST);

// Delete
router.delete("/:id", controller.deleteRegionGST);

module.exports = router;
