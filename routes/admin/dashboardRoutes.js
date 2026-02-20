const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/dashboardController.js");
const { auth, isAdmin } = require("../../middleware/auth.middleware.js");

// GET Admin Dashboard Data
router.get("/", auth, isAdmin, controller.getAdminDashboard);

module.exports = router;
