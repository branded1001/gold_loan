const router = require("express").Router();
const { auth, isAdmin } = require("../../middleware/auth.middleware");
const {getAllVisits,} = require("../../controllers/admin/visit.controller");

// router.post("/", auth, isAdmin, createVisit);

router.get("/", auth, isAdmin, getAllVisits);

// router.put("/cancel/:id", auth, isAdmin, cancelVisit);

// router.delete("/:id", auth, isAdmin, deleteVisit);

module.exports = router;
