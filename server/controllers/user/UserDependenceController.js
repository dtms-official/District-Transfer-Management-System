const UserDependence = require("../../models/UserDependence");
const CrudService = require("../../services/CrudService");
const service = new CrudService(UserDependence);
const { dynamicValidation, runValidation, userValidation } = require("../../middleware/crudValidation");

exports.validate = [
  ...userValidation,
  ...dynamicValidation(["dependentName" , "gender", "dependent_DOB", "dependentRelationship", "live_with_dependant" ]),
  runValidation,
];

exports.create = (req, res) => service.create(req, res);
exports.getAll = (req, res) => service.getAll(req, res);
exports.getUnique = (req, res) => service.getUnique(req, res);
exports.getDataByUser = (req, res) => service.getDataByUser(req, res);
exports.update = (req, res) => service.update(req, res);
exports.delete = (req, res) => service.delete(req, res);


