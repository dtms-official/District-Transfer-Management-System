const express = require("express");
const router = express.Router();
const WorkplaceController = require("../../controllers/common/WorkplaceController");
const TransferWindowController = require("../../controllers/common/TransferWindowController");
const TransferApplcationController = require("../../controllers/common/TransferApplcationController");

// Work Places Routes
router.post(
  "/workplace",
  WorkplaceController.validate,
  WorkplaceController.create
);
router.get("/workplace", WorkplaceController.getAll);
router.get("/workplace/:id", WorkplaceController.getUnique);
router.put("/workplace/:id", WorkplaceController.update);
router.delete("/workplace/:id", WorkplaceController.delete);

// Transfer Window Routes
router.post(
  "/transfer-window",
  TransferWindowController.validate,
  TransferWindowController.create
);
router.get("/transfer-window", TransferWindowController.getAll);
router.get(
  "/transfer-window/:id",
  TransferWindowController.getUnique
);
router.put(
  "/transfer-window/:id",
  TransferWindowController.update
);
router.delete(
  "/transfer-window/:id",
  TransferWindowController.delete
);

// Transfer Applciaiton Routes
router.post(
  "/transfer-application",
  TransferApplcationController.validate,
  TransferApplcationController.create
);
router.get(
  "/transfer-application",
  TransferApplcationController.getAll
);
router.get(
  "/transfer-application/:id",
  TransferApplcationController.getUnique
);
router.put(
  "/transfer-application/:id",
  TransferApplcationController.update
);
router.delete(
  "/transfer-application/:id",
  TransferApplcationController.delete
);

module.exports = router;
