const express = require("express");
const router = express.Router();
const adminAuthController = require("../../controllers/admin/auth/adminAuthController");

// Route for admin register
router.post("/register", adminAuthController.registerAdmin);

// Route for admin login
router.post("/login", adminAuthController.loginAdmin);

router.put("/change-password/:id", adminAuthController.changePassword);

module.exports = router;
