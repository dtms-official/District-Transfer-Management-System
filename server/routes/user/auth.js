const express = require("express");
const router = express.Router();

// Importing the necessary middleware and controller functions
const {
  validateRegistration,
} = require("../../middleware/user/validateRegister");
const {
  registerUser,
  loginUser,
} = require("../../controllers/user/auth/authController"); // Added loginUser
const { validateLogin } = require("../../middleware/user/validateLogin");
const { loginRateLimiter } = require("../../middleware/user/rateLimiter");
const {
  changePassword,
} = require("../../controllers/user/auth/changePassword"); // Import change password function
const { resetPassword } = require("../../controllers/user/auth//resetPassword"); // Import change password function

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", validateRegistration, registerUser);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", loginRateLimiter, validateLogin, loginUser); // Added loginUser here

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private (User must be authenticated)
router.put("/change-password/:id", changePassword);

router.put("/reset-password/:id", resetPassword);

module.exports = router;
