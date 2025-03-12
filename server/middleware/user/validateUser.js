const { check, validationResult } = require("express-validator");
const User = require("../../models/User");

exports.validateUser = [
  check("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID")
    .custom(async (value) => {
      const user = await User.findById(value);
      if (!user) {
        throw new Error("User not found");
      }
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
