const express = require("express");

const router = express.Router();
const transferApplcaitions = require("../../controllers/admin/transferApplcaitions");

// Get Routes
router.get("/total-transfer-applcation", transferApplcaitions.getTotalSubmitedTransferApplcations);
router.get("/rejected-transfer-applcation", transferApplcaitions.getRejectedTransferApplcations);
router.get("/checked-transfer-applcation", transferApplcaitions.getCheckedTransferApplcations);
router.get("/recommended-transfer-applcation", transferApplcaitions.getRecommendedTransferApplcations);
router.get("/approved-transfer-applcation", transferApplcaitions.getApprovedTransferApplcations);


// Update Routes
router.put("/check-applcation/:id", transferApplcaitions.checkTransferApplcation);
router.put("/recommend-applcation/:id", transferApplcaitions.recommendTransferApplcation);
router.put("/approve-applcation/:id", transferApplcaitions.approveTransferApplcation);
router.put("/reject-applcation/:id", transferApplcaitions.rejectTransferApplcation);

module.exports = router;
