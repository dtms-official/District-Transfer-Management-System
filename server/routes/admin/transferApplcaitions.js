const express = require("express");

const router = express.Router();
const transferApplcaitions = require("../../controllers/admin/transferApplcaitionsController");
const transferProcessController = require("../../controllers/admin/transferProcessController");

// Get Routes
router.get("/total-applications", transferApplcaitions.getTotalSubmitedTransferApplications);
router.get("/pending-applications", transferApplcaitions.getPendingTransferApplications);
router.get("/rejected-applications", transferApplcaitions.getRejectedTransferApplications);
router.get("/checked-applications", transferApplcaitions.getCheckedTransferApplications);
router.get("/recommended-applications", transferApplcaitions.getRecommendedTransferApplications);
router.get("/approved-applications", transferApplcaitions.getApprovedTransferApplications);

// Update Routes
router.put("/check-application/:id", transferApplcaitions.checkTransferApplication);
router.put("/recommend-application/:id", transferApplcaitions.recommendTransferApplication);
router.put("/approve-application/:id", transferApplcaitions.approveTransferApplication);
router.put("/reject-application/:id", transferApplcaitions.rejectTransferApplication);


// Transfer logic Routes
router.put("/transfer-application/process/:userId", transferProcessController.transferProcess);
router.put("/transfer-application/find/:userId", transferProcessController.findReplacement);
router.put("/transfer-application/publish/:userId", transferProcessController.publishApplication);

module.exports = router;
