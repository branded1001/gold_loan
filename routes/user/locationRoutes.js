const router = require("express").Router();
const { trackLocation, getAllValuerLocations } = require("../../controllers/user/LocationController");
const { auth, isValuer, isAdmin } = require("../../middleware/auth.middleware");

router.post("/", auth, isValuer, trackLocation);

//admin
router.get("/", auth, isAdmin, getAllValuerLocations);

module.exports = router;
