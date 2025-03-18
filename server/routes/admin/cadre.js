const express = require("express");
const router = express.Router();
const cadreContrroller = require("../../controllers/admin/cadreContrroller");

// Cadre Routes
router.post("/cadre",  cadreContrroller.validateCadre, cadreContrroller.createCadre);
router.get("/cadre", cadreContrroller.getAllCadres);
router.get("/cadre/:id", cadreContrroller.getOneCadre);
router.put("/cadre/:id", cadreContrroller.updateCadre);
router.delete("/cadre/:id", cadreContrroller.deleteCadre);

module.exports = router;
