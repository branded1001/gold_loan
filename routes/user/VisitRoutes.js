const express = require("express");
const router = express.Router();

const visitController = require("../../controllers/user/visitController");
const {auth, isValuer} = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload"); // multer


/* =====================================================
   ✅ MASTER DATA (BANK + REGION + BRANCH)
===================================================== */

router.get(
  "/master-data",
  auth,
  isValuer,
  visitController.getMasterData
);


/* =====================================================
   ✅ VISIT CRUD (USER)
===================================================== */

// Create Visit
router.post(
  "/create",
  auth,
    isValuer,
  visitController.createVisit
);

// Get My Visit History
router.get(
  "/my-visits",
  auth,
    isValuer,
  visitController.myVisits
);


/* =====================================================
   ✅ VISIT ACTIONS
===================================================== */

// Start Visit
router.put(
  "/start/:id",
  auth,
    isValuer,
  visitController.startVisit
);

// No Customer
router.put(
  "/no-customer/:id",
  auth,
    isValuer,
  visitController.noCustomer
);

// End Visit (Image Optional)
router.put(
  "/end/:id",
  auth,
    isValuer,
  upload.single("image"),   // field name = image
  visitController.endVisit
);


module.exports = router;
