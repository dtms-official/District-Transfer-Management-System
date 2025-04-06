const express = require("express");

const router = express.Router();
const transferApplcaitions = require("../../controllers/admin/transferApplcaitionsController");

// Get Routes
router.get("/total-transfer-application", transferApplcaitions.getTotalSubmitedTransferApplications);
router.get("/pending-transfer-application", transferApplcaitions.getPendingTransferApplications);
router.get("/rejected-transfer-application", transferApplcaitions.getRejectedTransferApplications);
router.get("/checked-transfer-application", transferApplcaitions.getCheckedTransferApplications);
router.get("/recommended-transfer-application", transferApplcaitions.getRecommendedTransferApplications);
router.get("/approved-transfer-application", transferApplcaitions.getApprovedTransferApplications);


// Update Routes
router.put("/check-application/:id", transferApplcaitions.checkTransferApplication);
router.put("/recommend-application/:id", transferApplcaitions.recommendTransferApplication);
router.put("/approve-application/:id", transferApplcaitions.approveTransferApplication);
router.put("/reject-application/:id", transferApplcaitions.rejectTransferApplication);

module.exports = router;
