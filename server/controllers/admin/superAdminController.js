const Admin = require("../../models/Admin");

exports.getTotalAdmins = async (req, res) => {
  try {
    const adminList = await Admin.find({ adminRole: { $ne: "superAdmin" } });

    res.status(200).json(adminList);
  } catch (error) {
    console.error("Error fetching pending users:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const deleted = await Admin.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Record Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};
