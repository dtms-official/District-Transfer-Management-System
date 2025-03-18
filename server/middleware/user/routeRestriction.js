const User = require("../../models/User");

// Middleware to check if user has accessed the route
exports.restrictRoute = async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ message: "User not found" });

  // Check if the user has already accessed this route
  if (user.hasAccessed) {
    return res
      .status(400)
      .json({ message: "You have already accessed this route" });
  }

  // Mark the user as having accessed the route
  user.hasAccessed = true;
  await user.save();

  next(); // Proceed to the route handler
};
