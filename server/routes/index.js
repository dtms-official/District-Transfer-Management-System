const authRoutes = require("./user/auth");
const userRoutes = require("./user/userRoutes");
const adminRoutes = require("./admin/adminRoutes");
const adminAuthRoutes = require("./admin/auth");
const baseRoutes = require("./baseRoutes");

module.exports = {
  authRoutes,
  userRoutes,
  adminRoutes,
  adminAuthRoutes,
  baseRoutes,
};
