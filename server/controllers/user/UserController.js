const { check, validationResult } = require("express-validator");
const User = require("../../models/User");

exports.validateUser = [
  check("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID")
    .custom(async (value) => {
      const user = await User.findById(value);
      if (!user) {
        throw new Error("User not found");
      }
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Route to get the profile progress of a user
exports.getUserProfileProgress = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user's progress value
    res.json({ progress: user.progressValue }); // Assuming progressValue is the field storing progress percentage
  } catch (err) {
    console.error("Error retrieving user progress:", err);
    res.status(500).json({ error: "Error retrieving user progress" });
  }
};
// exports.updateProfileProgress = async (req, res) => {
//   const userId = req.params.id;
//   const { collection } = req.body; // Get collection name from request body
//   const user = await User.findById(userId);

//   if (!user) return res.status(404).json({ message: "User not found" });

//   // Map of collections to the corresponding user submission fields
//   const collectionMap = {
//     usermedicalconditions: "isMedicalConditionSubmited",
//     userworkhistories: "isWorkHistorySubmited",
//     userdependences: "isDependenceSubmited",
//     userdisabilities: "isDisabilitySubmited",
//     userdiseases: "isDiseaseSubmited",
//   };

//   const submissionField = collectionMap[collection];

//   if (!submissionField)
//     return res.status(400).json({ error: "Invalid collection name" });

//   // Check if the submission has already been made for the collection
//   if (user[submissionField]) {
//     return res.status(400).json({
//       error: `You have already submitted for ${collection}`,
//     });
//   }

//   // Set the submission field to true
//   user[submissionField] = true;

//   // Add progress if collection exists
//   let progress = 15;

//   // Check for approval conditions
//   if (
//     user.isSubmited &&
//     user.isChecked &&
//     user.isRecommended &&
//     user.isApproved
//   ) {
//     progress += 10;
//   }

//   // Update progress value
//   user.progressValue += progress;
//   await user.save();

//   res.json({ message: "Progress updated!", progress });
// };

exports.updateProfileProgress = async (req, res) => {
  const userId = req.params.id;
  const { collection } = req.body;
  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ message: "User not found" });

  const collectionMap = {
    usermedicalconditions: "isMedicalConditionSubmited",
    userworkhistories: "isWorkHistorySubmited",
    userleavedetails: "isLeaveDetailsSubmited",
    userpettions: "isPettionSubmited",
    userdependences: "isDependenceSubmited",
    userdisabilities: "isDisabilitySubmited",
    userdiseases: "isDiseaseSubmited",
  };

  const submissionField = collectionMap[collection];

  if (!submissionField)
    return res.status(400).json({ error: "Invalid collection name" });

  if (user[submissionField]) {
    return res.json({ warning: "Already saved" });
  }

  user[submissionField] = true;
  user.progressValue += 10;

  if (
    user.isSubmited &&
    user.isChecked &&
    user.isRecommended &&
    user.isApproved
  ) {
    user.progressValue += 15;
  }

  await user.save();
  res.json({ message: "Profile updated!", progress: user.progressValue });
};

// Get  User using id
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Find by id passed in the request
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};

// Get All Users
exports.getAllUsers = async (_req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};
exports.updateUser = async (req, res) => {
  const { email, NIC, contactNumber } = req.body;
  const userId = req.params.id; // Get the current user ID

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if email already exists, excluding the current user
    if (email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
      if (existingEmail) {
        return res.status(400).json({
          error: "This email is already registered. Please try a different one",
        });
      }
    }

    // Check if NIC already exists, excluding the current user
    if (NIC) {
      const existingNIC = await User.findOne({ NIC, _id: { $ne: userId } });
      if (existingNIC) {
        return res.status(400).json({
          error: "This NIC is already registered. Please try a different one",
        });
      }
    }

    // Check if contactNumber already exists, excluding the current user
    if (contactNumber) {
      const existingContactNumber = await User.findOne({
        contactNumber,
        _id: { $ne: userId },
      });
      if (existingContactNumber) {
        return res.status(400).json({
          error:
            "This contact number is already registered. Please try a different one",
        });
      }
    }

    // Update user details and set isUpdated to true
    const updatedUser = await User.findByIdAndUpdate(
      userId, // Use the userId from req.params.id
      { $set: { ...req.body, isUpdated: true, rejectReason: null } }, // Dymamicly update values
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User Not Found" });
    }

    res.json({ message: "Profile updated successfully", data: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User Not Found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
};
