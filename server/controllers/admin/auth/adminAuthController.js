const jwt = require("jsonwebtoken");
const Admin = require("../../../models/Admin"); // Use Admin model for admin authentication
const bcrypt = require("bcryptjs");

// Register Admin
exports.registerAdmin = async (req, res) => {
  const { adminRole, workplace_id } = req.body;
  if (!adminRole || !workplace_id)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const existingAdminRole = await Admin.findOne({ workplace_id, adminRole });
    if (existingAdminRole)
      return res
        .status(400)
        .json({ error: `Admin role already exists for this workplace` });

    // Generate admin ID with role prefix
    const prefix =
      adminRole === "checkingAdmin"
        ? "C"
        : adminRole === "recommendAdmin"
        ? "R"
        : adminRole === "approveAdmin"
        ? "A"
        : "S";
    const adminId = `${prefix}${Math.floor(
      1000 + Math.random() * 9000
    )}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;

    // Generate a random 6-digit password
    const password = Math.floor(100000 + Math.random() * 900000).toString();
    const securePassword = await bcrypt.hash(password, 10); // Hashed version

    // Check if admin ID exists
    if (await Admin.findOne({ adminId }))
      return res.status(400).json({ error: "Admin ID exists" });

    // Save admin data with both plain & hashed password
    await new Admin({
      adminId,
      adminRole,
      workplace_id,
      password, // Storing plain text password
      securePassword, // Storing encrypted password
    }).save();

    res.status(201).json({
      message: "Admin registered successfully",
      adminId,
      password, // Return non-encrypted password in response
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const generateTokens = (admin) => {
  // Access token: includes adminId and adminRole, expires in 15 minutes
  const accessToken = jwt.sign(
    {
      id: admin._id,
      adminRole: admin.adminRole,
      workplace_id: admin.workplace_id,
    }, // Include adminRole here
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );

  return { accessToken };
};

exports.loginAdmin = async (req, res) => {
  const { adminId, securePassword } = req.body;

  try {
    if (!adminId || !securePassword) {
      return res
        .status(400)
        .json({ message: "Admin ID and password are required" });
    }

    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      return res.status(401).json({ message: "Admin ID is incorrect" });
    }

    if (!admin.securePassword) {
      return res.status(500).json({ message: "Admin password is not set" });
    }

    const isPasswordValid = await bcrypt.compare(
      securePassword,
      admin.securePassword
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    const { accessToken } = generateTokens(admin);

    return res.json({
      message: "Login successful",
      accessToken,
      adminRole: admin.adminRole,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Admin Change Password Controller
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // Find the user
    const admin = await Admin.findOne({ _id: req.params.id });
    if (!admin) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate the old password
    const isMatch = await bcrypt.compare(oldPassword, admin.securePassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Incorrect old password. Please try again." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the admin's password in the database
    admin.securePassword = hashedNewPassword;
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Change Password Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
