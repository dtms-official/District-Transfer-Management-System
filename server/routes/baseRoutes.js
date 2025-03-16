const express = require("express");
const router = express.Router();
const WorkplaceController = require("../controllers/WorkplaceController");
const TransferWindowController = require("../controllers/TransferWindowController");

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

module.exports = router;
