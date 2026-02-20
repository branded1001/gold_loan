const router = require("express").Router();
const branchController = require("../../controllers/admin/BranchController");
const { auth, isAdmin } = require("../../middleware/auth.middleware");

// Admin only routes
router.post("/", auth, isAdmin, branchController.createBranch);
router.get("/", auth, isAdmin, branchController.getBranches);
router.get("/:id", auth, isAdmin, branchController.getBranchById);
router.put("/:id", auth, isAdmin, branchController.updateBranch);
router.delete("/:id", auth, isAdmin, branchController.deleteBranch);

module.exports = router;
