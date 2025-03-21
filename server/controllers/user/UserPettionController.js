const UserPettion = require("../../models/UserPettion");
const CrudService = require("../../services/CrudService");
const service = new CrudService(UserPettion);
const { dynamicValidation, runValidation, userValidation } = require("../../middleware/crudValidation");

exports.validate = [
  ...dynamicValidation([]),
  ...userValidation, 
  runValidation,
];

exports.create = (req, res) => service.create(req, res);
exports.getAll = (req, res) => service.getAll(req, res);
exports.getUnique = (req, res) => service.getUnique(req, res);
exports.getDataByUser = (req, res) => service.getDataByUser(req, res);
exports.update = (req, res) => service.update(req, res);
exports.delete = (req, res) => service.delete(req, res);


