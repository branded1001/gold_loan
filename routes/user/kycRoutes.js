const router = require("express").Router();
const upload = require("../../middleware/upload");
const { auth, isValuer } = require("../../middleware/auth.middleware");
const kycController = require("../../controllers/user/kycController");

router.post(
  "/submit",
  auth,
  isValuer,
  upload.array("documents", 3), 
  kycController.submitKyc
);

module.exports = router;