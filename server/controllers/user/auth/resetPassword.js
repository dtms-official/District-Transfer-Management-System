const bcrypt = require("bcryptjs");
const User = require("../../../models/User");

exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};
