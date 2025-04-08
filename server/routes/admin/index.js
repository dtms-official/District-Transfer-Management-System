const express = require("express");
const router = express.Router();

// Import all route files
const adminAuthRoutes = require("./auth");
const cadreRoutes = require("./cadre");
const accessRoutes = require("./access");
const transferApplcaitions = require("./transferApplcaitions");

// Use the routes
router.use("/auth/admin", adminAuthRoutes); // All admin routes under /api/admin
router.use("/admin", accessRoutes); // All admin routes under /api/admin
router.use("/admin", transferApplcaitions); // All admin routes under /api/admin
router.use("/admin", cadreRoutes); // All cadre routes under /api/cadre

module.exports = router;
