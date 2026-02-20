const router = require("express").Router();

const {
  signup,
  login,
  forgotPassword,
  resetPassword
} = require("../../controllers/AuthController");

// Register
// router.post("/signup", signup);

// Login
router.post("/login", login);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;
