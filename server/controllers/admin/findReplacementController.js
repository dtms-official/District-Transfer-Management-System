const User = require("../../models/User");
const TransferApplication = require("../../models/TransferApplication");

exports.findReplacement = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const transferApplication = await TransferApplication.findOne({ userId });
    if (!transferApplication) {
      return res
        .status(404)
        .json({ success: false, error: "Transfer application not found" });
    }

    const userWorkplace = user.workplace_id;
    const transferWorkplace = transferApplication.transfered_workplace_id;
    const designation = user.designation;

    const replacementUser = await User.findOne({
      _id: { $ne: userId },
      designation: designation,
      workplace_id: transferWorkplace,
    }).select("nameWithInitial designation NIC");

    if (!replacementUser) {
      return res
        .status(404)
        .json({ success: false, error: "No replacement user found" });
    }

    // If replacement user exists, process and send final response
    transferApplication.Replacement_userId = replacementUser._id;
    transferApplication.transferDesision = "Processed with replacement";
    await transferApplication.save();

    return res.status(200).json({
      success: true,
      message: "Replacement user found and processed",
      data: {
        userId,
        Replacement_userId: replacementUser._id,
        replacementUser,
      },
    });

    // if (replacementUser) {
    //   transferApplication.Replacement_userId = replacementUser?._id;
    //   transferApplication.transferDesision = "Processed with replacement";
    // } else {
    //   transferApplication.transferDesision = "Processed without replacement";
    // }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
