const router = require("express").Router();
const upload = require("../../middleware/upload.js");
const { auth, isValuer } = require("../../middleware/auth.middleware.js");
const kycController = require("../../controllers/user/kycController.js");

router.post(
  "/submit",
  auth,
  isValuer,
  upload.array("documents", 3), 
  kycController.submitKyc
);

module.exports = router;