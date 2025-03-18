const express = require("express");
const { validateUser } = require("../../middleware/user/validateUser");
const { restrictRoute } = require("../../middleware/user/routeRestriction");

const UserController = require("../../controllers/user/UserController");
const UserDependenceController = require("../../controllers/user/UserDependenceController");
const UserDisabilityController = require("../../controllers/user/UserDisabilityController");
const UserDiseaseController = require("../../controllers/user/UserDiseaseController");
const UserMedicalConditionController = require("../../controllers/user/UserMedicalConditionController");
const UserWorkHistoryController = require("../../controllers/user/UserWorkHistoryController");
const UserLeaveDetailsController = require("../../controllers/user/UserLeaveDetailsController");
const UserPettionController = require("../../controllers/user/UserPettionController");

const router = express.Router();

router.get(
  "/user/progress/:id",
  UserController.validateUser,
  UserController.getUserProfileProgress
);
router.put(
  "/user/progress/:id",
  UserController.validateUser,
  restrictRoute,
  UserController.updateProfileProgress
);

router.get("/user/:id", UserController.validateUser, UserController.getUser);
router.get("/user", UserController.getAllUsers);
router.put("/user/:id", UserController.validateUser, UserController.updateUser);
router.delete(
  "/user/:id",
  UserController.validateUser,
  UserController.deleteUser
);

router.post(
  "/dependence",
  validateUser,
  UserDependenceController.validateDependence,
  UserDependenceController.createDependence
);
router.get("/dependence", UserDependenceController.getAllDependences);
router.get("/dependence/:id", UserDependenceController.getOneDependence);
router.get(
  "/dependence/user/:userId",
  validateUser,
  UserDependenceController.getUserDependences
);
router.put("/dependence/:id", UserDependenceController.updateDependence);
router.delete("/dependence/:id", UserDependenceController.deleteDependence);

router.post(
  "/disability",
  validateUser,
  UserDisabilityController.validateDisability,
  UserDisabilityController.createDisability
);
router.get("/disability", UserDisabilityController.getAllDisabilities);
router.get("/disability/:id", UserDisabilityController.getOneDisability);
router.get(
  "/disability/user/:userId",
  validateUser,
  UserDisabilityController.getUserDisabilities
);
router.put("/disability/:id", UserDisabilityController.updateDisability);
router.delete("/disability/:id", UserDisabilityController.deleteDisability);

router.post(
  "/disease",
  UserDiseaseController.validateDisease,
  UserDiseaseController.createDisease
);
router.get("/disease", UserDiseaseController.getAllDiseases);
router.get("/disease/:id", UserDiseaseController.getOneDisease);
router.get(
  "/disease/user/:userId",
  validateUser,
  UserDiseaseController.getUserDiseases
);
router.put("/disease/:id", UserDiseaseController.updateDisease);
router.delete("/disease/:id", UserDiseaseController.deleteDisease);

router.post(
  "/medicalcondition",
  validateUser,
  UserMedicalConditionController.validateMedicalCondition,
  UserMedicalConditionController.createMedicalCondition
);
router.get(
  "/medicalcondition",
  UserMedicalConditionController.getAllMedicalConditions
);
router.get(
  "/medicalcondition/:id",
  UserMedicalConditionController.getOneMedicalCondition
);
router.get(
  "/medicalcondition/user/:userId",
  validateUser,
  UserMedicalConditionController.getUserMedicalConditions
);
router.put(
  "/medicalcondition/:id",
  UserMedicalConditionController.updateMedicalCondition
);
router.delete(
  "/medicalcondition/:id",
  UserMedicalConditionController.deleteMedicalCondition
);

router.post(
  "/workhistory",
  validateUser,
  UserWorkHistoryController.validateWorkHistory,
  UserWorkHistoryController.createWorkHistory
);

router.get("/workhistory", UserWorkHistoryController.getAllWorkHistories);
router.get("/workhistory/:id", UserWorkHistoryController.getOneWorkHistory);
router.get(
  "/workhistory/user/:userId",
  validateUser,
  UserWorkHistoryController.getUserWorkHistories
);
router.put("/workhistory/:id", UserWorkHistoryController.updateWorkHistory);
router.delete("/workhistory/:id", UserWorkHistoryController.deleteWorkHistory);

module.exports = router;
//user leave details
router.post(
  "/leavedetails",
  UserLeaveDetailsController.validateLeaveDetail,
  UserLeaveDetailsController.createLeaveDetail
);
router.get("/leavedetails", UserLeaveDetailsController.getAllLeaveDetails);
router.get("/leavedetails/:id", UserLeaveDetailsController.getOneLeaveDetail);
router.get(
  "/leavedetails/user/:userId",
  validateUser,
  UserLeaveDetailsController.getUserLeaveDetails
);
router.put("/leavedetails/:id", UserLeaveDetailsController.updateLeaveDetail);
router.delete(
  "/leavedetails/:id",
  UserLeaveDetailsController.deleteLeaveDetail
);

//user pettion details
router.post(
  "/pettion",
  UserPettionController.validatePettion,
  UserPettionController.createPettion
);
router.get("/pettion", UserPettionController.getAllPettion);
router.get("/pettion/:id", UserPettionController.getOnePettion);
router.get(
  "/pettion/user/:userId",
  validateUser,
  UserPettionController.getUserPettion
);
router.put("pettion/:id", UserPettionController.updatePettion);
router.delete("/pettion/:id", UserPettionController.deletePettion);

module.exports = router;
