const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/dashboardController");
const { auth, isAdmin } = require("../../middleware/auth.middleware");

// GET Admin Dashboard Data
router.get("/", auth, isAdmin, controller.getAdminDashboard);

module.exports = router;
