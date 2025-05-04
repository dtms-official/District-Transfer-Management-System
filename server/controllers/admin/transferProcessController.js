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
const geolib = require("geolib");

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  return (
    geolib.getDistance(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 }
    ) / 1000
  ).toFixed(2);
};

const getWorkplaceDistanceScore = async (user, Workplace) => {
  const GPS_longitude = user?.GPS_longitude;
  const GPS_latitude = user?.GPS_latitude;
  const workplaceId = user?.workplace_id;

  if (!GPS_latitude || !GPS_longitude || !workplaceId) return 0;

  const workplace = await Workplace.findById(workplaceId);
  if (!workplace || !workplace.GPS_latitude || !workplace.GPS_longitude) return 0;

  const distance = parseFloat(
    calculateDistance(
      parseFloat(GPS_latitude),
      parseFloat(GPS_longitude),
      parseFloat(workplace.GPS_latitude),
      parseFloat(workplace.GPS_longitude)
    )
  );

  let score = 0;
  if (distance <= 10) {
    score += 5;
  } else if (distance >= 10 && distance <= 25) {
    score += 15;
  } else  {
    score += 20;
  }

  return score;
};

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

    // User Info
    const distanceScore = getWorkplaceDistanceScore(user, Workplace);
    score += distanceScore;

    // Basic Infro
    const currentDate = new Date();
    const dutyDateObj = new Date(user?.duty_assumed_date);

    let yearsDifference = currentDate.getFullYear() - dutyDateObj.getFullYear();
    if (yearsDifference >= 3) score += 50;

    const birthDate = new Date(user?.dateOfBirth);
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    if (age < 58) score += 20;

    // Work History
    if (workhistory?.outer_district !== "Ampara") score += 30;
    if (workhistory?.resident_distance > 15) score += 15;
    // Worked in favourable station at Out of district 20

    const dependentDOB = dependence?.dependent_DOB;
    const dependentAge = dependentDOB ? Math.floor((new Date() - new Date(dependentDOB)) / (1000 * 60 * 60 * 24 * 365.25)) : null;

    // Civil status 
    if (user?.civil_status === "Married") {
      if (dependentAge < 5) score += 20;
      if (dependentAge >= 5 && dependentAge <= 17) score += 10;
    }
    
    // Gender
    if (user?.gender === "Female") score += 10;

    // Pettision
    if (!pettision) score += 25;

    // Dependence
    const depType = dependence?.natureOfDependency;
    const liveWith = dependence?.live_with_dependant;

    if (depType === "Infant") score += 5;
    if (depType === "School Going" || depType === "Non-School Going Child")
      score += 10;
    if (dependence?.breastfeeding_required === true) score += 5;
    if (depType === "Disabled Dependant" && liveWith === true) score += 20;

    if (depType === "Elderly Dependent" && dependentAge > 70 && liveWith === true) score += 15;

    if (
      depType === "Special Need" ||
      depType === "Affected by Chronic Disease" &&
      dependentAge > 70 && liveWith === true
    )
      score += 15;

    //Period Of Work
    const userAppointmenDate = user?.first_appointment_date;
    const years = userAppointmenDdate ? Math.floor((new Date() - new Date(userAppointmenDate)) / (1000 * 60 * 60 * 24 * 365.25)) : null;

    if(years <= 8){
      if(years >= 5)  score += 5;
      else if (years > 3)  score += 10;
    }
    // Health
    if (disease) score += 20;
    if (disease?.soft_work_recommendation === true) score += 5;

    // MedicalCondition
    if (medicalCondition) score += 10;
    if (medicalCondition?.type === "Surgery") score += 20;

    // Disability
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
      transferWorkplaceId = transferApplication.preferWorkplace_1; // Difficult Workplace
      workplaceCategory = "Difficult";
    } else if (score >= 100 && score <= 160) {
      transferWorkplaceId = transferApplication.preferWorkplace_2; // Moderate Workplace
      workplaceCategory = "Moderate";
    } else {
      transferWorkplaceId = transferApplication.preferWorkplace_3; // Prefered Workplace
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
        categorizedWorkplaces,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// exports.transferProcess = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, error: "User not found" });
//     }

//     const transferApplication = await TransferApplication.findOne({ userId });
//     if (!transferApplication) {
//       return res.status(404).json({
//         success: false,
//         error: "Transfer application not found",
//       });
//     }

//     const dependence = await UserDependence.findOne({ userId });
//     const disease = await UserDisease.findOne({ userId });
//     const disability = await UserDisability.findOne({ userId });
//     const medicalCondition = await UserMedicalCondition.findOne({ userId });
//     const workhistory = await UserWorkHistory.findOne({ userId });
//     const pettision = await UserPettion.findOne({ userId });

//     const workplaces = await Promise.all([
//       Workplace.findById(transferApplication.preferWorkplace_1),
//       Workplace.findById(transferApplication.preferWorkplace_2),
//       Workplace.findById(transferApplication.preferWorkplace_3),
//     ]);

//     if (workplaces.some((wp) => !wp)) {
//       return res.status(404).json({
//         success: false,
//         error: "Preferred workplaces not found",
//       });
//     }

//     const categorizedWorkplaces = await calculateWorkplaceDistance(
//       user,
//       workplaces
//     );

//     const score = generateScore(
//       user,
//       dependence,
//       disease,
//       disability,
//       medicalCondition,
//       workhistory,
//       pettision
//     );

//     let transferWorkplaceId = null;
//     let workplaceCategory = "";
//     if (score < 100) {
//       transferWorkplaceId = transferApplication.preferWorkplace_3;
//       workplaceCategory = "Difficult";
//     } else if (score >= 100 && score <= 160) {
//       transferWorkplaceId = transferApplication.preferWorkplace_2;
//       workplaceCategory = "Moderate";
//     } else {
//       transferWorkplaceId = transferApplication.preferWorkplace_1;
//       workplaceCategory = "Prefered";
//     }

//     const transferDesision = "Processed";
//     const isProcessed = true;

//     transferApplication.score = {
//       totalScore: score,
//       dutyYears: user.duty_assumed_date
//         ? new Date().getFullYear() -
//           new Date(user.duty_assumed_date).getFullYear()
//         : "N/A",
//       age: user.dateOfBirth
//         ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()
//         : "N/A",
//       outerDistrict: workhistory?.outer_district !== "Ampara" ? "Yes" : "No",
//       residentDistance: workhistory?.resident_distance > 15 ? "Yes" : "No",
//       civilStatus: user?.civil_status === "Married" ? "Married" : "Single",
//       gender: user?.gender === "Female" ? "Female" : "Male",
//       petitionStatus: pettision ? "No Petition" : "Has Petition",
//       dependency: {
//         infant: dependence?.natureOfDependency === "Infant" ? "Yes" : "No",
//         schoolChild:
//           dependence?.natureOfDependency === "School Going" ||
//           dependence?.natureOfDependency === "Non-School Going Child"
//             ? "Yes"
//             : "No",
//         breastfeeding:
//           dependence?.breastfeeding_required === true ? "Yes" : "No",
//         specialNeed:
//           dependence?.natureOfDependency === "Special Need" ? "Yes" : "No",
//         chronicDisease:
//           dependence?.natureOfDependency === "Affected by Chronic Disease"
//             ? "Yes"
//             : "No",
//         elderlyDependent:
//           dependence?.natureOfDependency === "Elderly Dependent" ? "Yes" : "No",
//         disabledDependent:
//           dependence?.natureOfDependency === "Disabled Dependant"
//             ? "Yes"
//             : "No",
//       },
//       disease: disease ? "Has Disease" : "No Disease",
//       softWorkRecommendation:
//         disease?.soft_work_recommendation === true ? "Yes" : "No",
//       medicalCondition: medicalCondition
//         ? "Has Medical Condition"
//         : "No Medical Condition",
//       disability: disability ? "Has Disability" : "No Disability",
//       disabilityLevel:
//         disability?.level === "Severe" ? "Severe" : "Mild/No Disability",
//     };

//     transferApplication.isProcessed = isProcessed;
//     transferApplication.transferDesision = transferDesision;
//     transferApplication.transfered_workplace_id = transferWorkplaceId;
//     transferApplication.transferDesisionType = workplaceCategory;

//     await transferApplication.save();

//     return res.status(200).json({
//       success: true,
//       data: {
//         userId,
//         isProcessed,
//         transferDesision,
//         transfered_workplace_id: transferWorkplaceId,
//         transferDesisionType: workplaceCategory,
//         categorizedWorkplaces,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

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
