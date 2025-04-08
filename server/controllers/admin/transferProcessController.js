const User = require("../../models/User");
const UserDependence = require("../../models/UserDependence");
const UserDisease = require("../../models/UserDisease");
const UserDisability = require("../../models/UserDisability");
const UserWorkHistory = require("../../models/UserWorkHistory");
const UserPettion = require("../../models/UserPettion");
const UserMedicalCondition = require("../../models/UserMedicalCondition");
const Workplace = require("../../models/Workplace");
const TransferApplication = require("../../models/TransferApplication");
const { calculateWorkplaceDistance } = require("./calculateWorkplaceDistance");

function generateScore(
  user,
  dependence,
  disease,
  disability,
  medicalCondition,
  pettision,
  workhistory
) {
  let score = 0;

  try {
    const currentDate = new Date();
    const dutyDateObj = new Date(user?.duty_assumed_date);

    let yearsDifference = currentDate.getFullYear() - dutyDateObj.getFullYear();
    if (yearsDifference >= 3) score += 50;

    const birthDate = new Date(user?.dateOfBirth);
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    if (age < 58) score += 20;

    if (workhistory?.outer_district !== "Ampara") score += 10;
    if (workhistory?.resident_distance > 15) score += 15;
    if (user?.civil_status === "Married") score += 10;
    if (user?.gender === "Female") score += 15;
    if (!pettision) score += 25;

    const depType = dependence?.natureOfDependency;
    if (depType === "Infant") score += 5;
    if (depType === "School Going" || depType === "Non-School Going Child")
      score += 10;
    if (dependence?.breastfeeding_required === true) score += 5;
    if (
      depType === "Special Need" ||
      depType === "Affected by Chronic Disease" ||
      depType === "Elderly Dependent" ||
      depType === "Disabled Dependant"
    )
      score += 10;

    if (disease) score += 15;
    if (disease?.soft_work_recommendation === true) score += 5;
    if (medicalCondition) score += 10;
    if (disability) score += 15;
    if (disability?.level === "Severe") score += 15;
  } catch (err) {
    console.error("Score generation error:", err.message);
  }

  return score;
}

exports.transferProcess = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const transferApplication = await TransferApplication.findOne({ userId });
    if (!transferApplication) {
      return res.status(404).json({
        success: false,
        error: "Transfer application not found",
      });
    }

    const dependence = await UserDependence.findOne({ userId });
    const disease = await UserDisease.findOne({ userId });
    const disability = await UserDisability.findOne({ userId });
    const medicalCondition = await UserMedicalCondition.findOne({ userId });
    const workhistory = await UserWorkHistory.findOne({ userId });
    const pettision = await UserPettion.findOne({ userId });

    const workplaces = await Promise.all([
      Workplace.findById(transferApplication.preferWorkplace_1),
      Workplace.findById(transferApplication.preferWorkplace_2),
      Workplace.findById(transferApplication.preferWorkplace_3),
    ]);

    if (workplaces.some((wp) => !wp)) {
      return res.status(404).json({
        success: false,
        error: "Preferred workplaces not found",
      });
    }

    const categorizedWorkplaces = await calculateWorkplaceDistance(
      user,
      workplaces
    );

    const score = generateScore(
      user,
      dependence,
      disease,
      disability,
      medicalCondition,
      workhistory,
      pettision
    );

    let transferWorkplaceId = null;
    if (score < 100) {
      transferWorkplaceId = transferApplication.preferWorkplace_3; // Difficult Workplace
      workplaceCategory = "Difficult";
    } else if (score >= 100 && score <= 160) {
      transferWorkplaceId = transferApplication.preferWorkplace_2; // Moderate Workplace
      workplaceCategory = "Moderate";
    } else {
      transferWorkplaceId = transferApplication.preferWorkplace_1; // Prefered Workplace
      workplaceCategory = "Prefered";
    }

    const transferDesision = "Processed";
    const isProcessed = true;
    transferApplication.score = score;
    transferApplication.isProcessed = isProcessed;
    transferApplication.transferDesision = transferDesision;
    transferApplication.transfered_workplace_id = transferWorkplaceId;
    transferApplication.transferDesisionType = workplaceCategory;

    await transferApplication.save();

    return res.status(200).json({
      success: true,
      data: {
        userId,
        isProcessed,
        transferDesision,
        score,
        transfered_workplace_id: transferWorkplaceId,
        transferDesisionType: workplaceCategory,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.findReplacement = async (req, res) => {};

exports.publishApplication = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const transferApplication = await TransferApplication.findOne({ userId });
    if (!transferApplication) {
      return res.status(404).json({
        success: false,
        error: "Transfer application not found",
      });
    }

    transferApplication.isPublished = true;
    await transferApplication.save();

    return res.status(200).json({
      success: true,
      message: "Transfer applicaiton published successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
