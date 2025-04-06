const express = require("express");
const router = express.Router();
const transferProcessController  = require("../../controllers/admin/transferProcessController");

router.get("/transfer-process/:userId", transferProcessController.processTransfer);

module.exports = router;
