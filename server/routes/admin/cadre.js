const express = require("express");
const router = express.Router();
const cadreContrroller = require("../../controllers/admin/cadreContrroller");

// Cadre Routes
router.post(
  "/cadre",
  cadreContrroller.validate,
  cadreContrroller.create
);
router.get("/cadre", cadreContrroller.getAll);
router.get("/cadre/:id", cadreContrroller.getUnique);
router.put("/cadre/:id", cadreContrroller.update);
router.delete("/cadre/:id", cadreContrroller.delete);

module.exports = router;
