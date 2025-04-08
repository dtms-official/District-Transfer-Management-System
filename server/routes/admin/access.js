const express = require("express");

const router = express.Router();
const accessController = require("../../controllers/admin/accessController");
const superAdminController = require("../../controllers/admin/superAdminController");

// Get Routes
router.get("/total-users", accessController.getTotalSubmitedUsers);
router.get("/pending-users", accessController.getPendingUsers);
router.get("/rejected-users", accessController.getRejectedUsers);
router.get("/checked-users", accessController.getCheckedUsers);
router.get("/recommended-users", accessController.getRecommendedUsers);
router.get("/approved-users", accessController.getApprovedUsers);

// Update Routes
router.put("/check/:userId", accessController.checkUser);
router.put("/recommend/:userId", accessController.recommendUser);
router.put("/approve/:userId", accessController.approveUser);
router.put("/reject/:userId", accessController.rejectUser);

// Super admin routes
router.get("/total-admin", superAdminController.getTotalAdmins);
router.delete("/total-admin/:id", superAdminController.deleteAdmin);

module.exports = router;
