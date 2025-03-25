const UserMedicalCondition = require("../../models/UserMedicalCondition");
const CrudService = require("../../services/CrudService");
const service = new CrudService(UserMedicalCondition);
const { dynamicValidation, runValidation, userValidation } = require("../../middleware/crudValidation");

exports.validate = [
  ...userValidation, 
  ...dynamicValidation(["type","notes"]),
  runValidation,
];

exports.create = (req, res) => service.create(req, res);
exports.getAll = (req, res) => service.getAll(req, res);
exports.getUnique = (req, res) => service.getUnique(req, res);
exports.getDataByUser = (req, res) => service.getDataByUser(req, res);
exports.update = (req, res) => service.update(req, res);
exports.delete = (req, res) => service.delete(req, res);


