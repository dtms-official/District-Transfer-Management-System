const express = require("express");
const router = express.Router();

// Import all route files
const adminAuthRoutes = require("./auth");
const cadreRoutes = require("./cadre");
const adminRoutes = require("./access");

// Use the routes
router.use("/auth/admin", adminAuthRoutes); // All admin routes under /api/admin
router.use("/admin", adminRoutes); // All admin routes under /api/admin
router.use("/admin", cadreRoutes); // All cadre routes under /api/cadre

module.exports = router;
