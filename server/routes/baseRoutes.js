const express = require("express");
const router = express.Router();
const WorkplaceController = require("../controllers/WorkplaceController");
const TransferWindowController = require("../controllers/TransferWindowController");
const TransferApplcationController = require("../controllers/TransferApplcationController");

// Work Places Routes
router.post(
  "/workplace",
  WorkplaceController.validateWorkplace,
  WorkplaceController.createWorkPlace
);
router.get("/workplace", WorkplaceController.getAllWorkplaces);
router.get("/workplace/:id", WorkplaceController.getOneWorkplace);

// Transfer Window Routes
router.post(
  "/transfer-window",
  TransferWindowController.validateTransferWindow,
  TransferWindowController.createTransferWindow
);
router.get("/transfer-window", TransferWindowController.getAllTransferWindows);
router.get("/transfer-window/:id", TransferWindowController.getOneTransferWindow);
router.put("/transfer-window/:id", TransferWindowController.updateTransferWindow);


// Transfer Window Routes
router.post(
  "/transfer-application",
  TransferApplcationController.validateTransferApplcation,
  TransferApplcationController.createTransferApplcation
);
router.get("/transfer-application", TransferApplcationController.getAllTransferApplcations);
router.get("/transfer-application/:id", TransferApplcationController.getOneTransferApplcation);
router.put("/transfer-application/:id", TransferApplcationController.updateTransferApplcation);

module.exports = router;
