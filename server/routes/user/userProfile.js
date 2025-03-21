const express = require("express");

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
  UserDependenceController.validate,
  UserDependenceController.create
);
router.get("/dependence", UserDependenceController.getAll);
router.get("/dependence/:id", UserDependenceController.getUnique);
router.get("/dependence/user/:id", UserDependenceController.getDataByUser);
router.put("/dependence/:id", UserDependenceController.update);
router.delete("/dependence/:id", UserDependenceController.delete);

router.post(
  "/disability",
  UserDisabilityController.validate,
  UserDisabilityController.create
);
router.get("/disability", UserDisabilityController.getAll);
router.get("/disability/:id", UserDisabilityController.getUnique);
router.get("/disability/user/:id", UserDisabilityController.getDataByUser);
router.put("/disability/:id", UserDisabilityController.update);
router.delete("/disability/:id", UserDisabilityController.delete);

router.post("/disease",UserDiseaseController.validate, UserDiseaseController.create);
router.get("/disease", UserDiseaseController.getAll);
router.get("/disease/:id", UserDiseaseController.getUnique);
router.get("/disease/user/:id", UserDiseaseController.getDataByUser);
router.put("/disease/:id", UserDiseaseController.update);
router.delete("/disease/:id", UserDiseaseController.delete);

router.post(
  "/medicalcondition",
  UserMedicalConditionController.validate,
  UserMedicalConditionController.create
);
router.get("/medicalcondition", UserMedicalConditionController.getAll);
router.get("/medicalcondition/:id", UserMedicalConditionController.getUnique);
router.get(
  "/medicalcondition/user/:id",
  UserMedicalConditionController.getDataByUser
);
router.put("/medicalcondition/:id", UserMedicalConditionController.update);
router.delete("/medicalcondition/:id", UserMedicalConditionController.delete);

router.post(
  "/workhistory",
  UserWorkHistoryController.validate,
  UserWorkHistoryController.create
);

router.get("/workhistory", UserWorkHistoryController.getAll);
router.get("/workhistory/:id", UserWorkHistoryController.getUnique);
router.get("/workhistory/user/:id", UserWorkHistoryController.getDataByUser);
router.put("/workhistory/:id", UserWorkHistoryController.update);
router.delete("/workhistory/:id", UserWorkHistoryController.delete);

module.exports = router;
//user leave details
router.post(
  "/leavedetails",
  UserLeaveDetailsController.validate,
  UserLeaveDetailsController.create
);
router.get("/leavedetails", UserLeaveDetailsController.getAll);
router.get("/leavedetails/:id", UserLeaveDetailsController.getUnique);
router.get("/leavedetails/user/:id", UserLeaveDetailsController.getDataByUser);
router.put("/leavedetails/:id", UserLeaveDetailsController.update);
router.delete("/leavedetails/:id", UserLeaveDetailsController.delete);

//user pettion details
router.post(
  "/pettion",
  UserPettionController.validate,
  UserPettionController.create
);
router.get("/pettion", UserPettionController.getAll);
router.get("/pettion/:id", UserPettionController.getUnique);
router.get("/pettion/user/:id", UserPettionController.getDataByUser);
router.put("/pettion/:id", UserPettionController.update);
router.delete("/pettion/:id", UserPettionController.delete);

module.exports = router;
