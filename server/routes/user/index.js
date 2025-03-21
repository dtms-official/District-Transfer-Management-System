const express = require("express");
const router = express.Router();

// Import all route files
const authRoutes = require("./auth");
const userRoutes = require("./userProfile");

// Use the routes
router.use("/auth", authRoutes); 
router.use("/user", userRoutes); 

module.exports = router;
