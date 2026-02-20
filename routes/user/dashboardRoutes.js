const express = require("express");
const router = express.Router();
const controller = require("../../controllers/user/dashboardController");

const { auth, isValuer } = require("../../middleware/auth.middleware");

router.get("/", auth, isValuer, controller.getUserDashboard);

module.exports = router;
