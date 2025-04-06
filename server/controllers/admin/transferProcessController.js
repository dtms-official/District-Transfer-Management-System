const mongoose = require("mongoose");
const User = require("../models/User");
const Workplace = require("../models/Workplace");
const TransferApplication = require("../models/TransferApplication");

// Distance Calculator using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

// Classify Workplace Distance
const classifyDistance = (distance) => {
  if (distance < 100) return "preferred";
  else if (distance <= 160) return "moderate";
  else return "difficult";
};

// Controller: Process transfer with logic breakdown
exports.processTransfer = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await TransferApplication.findById(applicationId)
      .populate("userId")
      .populate("preferWorkplace_1 preferWorkplace_2 preferWorkplace_3");

    if (!application) return res.status(404).json({ error: "Application not found" });

    const user = application.userId;

    const userLat = parseFloat(user.GPS_latitude);
    const userLon = parseFloat(user.GPS_longitude);

    const dist1 = calculateDistance(userLat, userLon, application.preferWorkplace_1.GPS_latitude, application.preferWorkplace_1.GPS_longitude);
    const dist2 = calculateDistance(userLat, userLon, application.preferWorkplace_2.GPS_latitude, application.preferWorkplace_2.GPS_longitude);
    const dist3 = calculateDistance(userLat, userLon, application.preferWorkplace_3.GPS_latitude, application.preferWorkplace_3.GPS_longitude);

    const preferWorkplace_1_category = classifyDistance(dist1);
    const preferWorkplace_2_category = classifyDistance(dist2);
    const preferWorkplace_3_category = classifyDistance(dist3);

    // 🎯 Transfer Logic Points
    const pointsBreakdown = {
      notAppliedForTransfer: user.appliedForTransfer === false ? 10 : 0,
      threeYearsAtWorkplace: user.yearsAtCurrentWorkplace > 3 ? 50 : 0,
      ageBelow58: (() => {
        if (user.dateOfBirth) {
          const age = new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear();
          return age < 58 ? 20 : 0;
        }
        return 0;
      })(),
      notWorkedOutsideDistrict: user.workedOutsideDistrict === false ? 10 : 0,
      notWorkedFarFromResidence: user.workedOver15km === false ? 15 : 0,
      civilStatusSingle: user.civil_status === "Single" ? 10 : 0,
      genderMale: user.gender === "Male" ? 15 : 0,
      noPetitions: user.hasPetitions === false ? 25 : 0,
      noInfantChild: user.hasInfantChild === false ? 5 : 0,
      noSchoolChild: user.hasSchoolChild === false ? 10 : 0,
      notLactatingMother: user.isLactatingMother === false ? 5 : 0,
      noDependents: user.hasSpecialDependents === false ? 10 : 0,
      noDisease: user.hasAnyDisease === false ? 15 : 0,
      noSoftWork: user.needsSoftWork === false ? 5 : 0,
      noMedicalCondition: user.hasMedicalCondition === false ? 10 : 0,
      noDisability: user.hasDisability === false ? 15 : 0,
      noSevereDisability: user.hasSevereDisability === false ? 15 : 0,
    };

    const totalScore = Object.values(pointsBreakdown).reduce((a, b) => a + b, 0);

    return res.status(200).json({
      applicationId,
      user: user.nameWithInitial || user.firstName,
      totalScore,
      scoreBreakdown: pointsBreakdown,
      workplacePlacements: {
        preferWorkplace_1: preferWorkplace_1_category,
        preferWorkplace_2: preferWorkplace_2_category,
        preferWorkplace_3: preferWorkplace_3_category,
      },
    });
  } catch (error) {
    console.error("Transfer processing error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};