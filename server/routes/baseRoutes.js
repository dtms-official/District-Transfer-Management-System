const express = require("express");
const router = express.Router();
const WorkplaceController = require("../controllers/WorkplaceController");

// Work Places Route
router.post(
  "/workplace",
  WorkplaceController.validateWorkplace,
  WorkplaceController.createWorkPlace
);
router.get("/workplace", WorkplaceController.getAllWorkplaces);
router.get("/workplace/:id", WorkplaceController.getOneWorkplace);

module.exports = router;
