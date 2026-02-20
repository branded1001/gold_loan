const express = require("express");
const router = express.Router();
const controller = require("../../controllers/user/dashboardController.js");

const { auth, isValuer } = require("../../middleware/auth.middleware.js");

router.get("/", auth, isValuer, controller.getUserDashboard);

module.exports = router;
