const TransferModel = require("../../models/TransferApplcation");
const CrudService = require("../../services/CrudService");
const service = new CrudService(TransferModel);
const { dynamicValidation, runValidation } = require("../../middleware/crudValidation");

exports.validate = [
  // ...dynamicValidation(["transferWindowId", "preferWorkplace_1", "preferWorkplace_2", "preferWorkplace_3", "remarks"]),
  // runValidation,
];

exports.create = (req, res) => service.create(req, res);
exports.getAll = (req, res) => service.getAll(req, res);
exports.getUnique = (req, res) => service.getUnique(req, res);
exports.update = (req, res) => service.update(req, res);
exports.delete = (req, res) => service.delete(req, res);
