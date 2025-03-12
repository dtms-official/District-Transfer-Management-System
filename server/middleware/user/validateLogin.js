const validateLogin = (req, res, next) => {
  const { NIC, password } = req.body;

  const errors = [];

  if (!NIC) errors.push("NIC is required");
  if (!password) errors.push("Password is required");

  if (NIC) {
    const nicRegex = /^[0-9]{9}[Vv]$|^[0-9]{12}$/;
    if (!nicRegex.test(NIC)) {
      errors.push("Invalid NIC format");
    }
  }

  if (password && password.length < 6) {
    errors.push("Password should be at least 6 characters long");
  }

  if (errors.length > 0) {
    return res
      .status(400)
      .json({ error: errors });
  }

  next();
};

module.exports = { validateLogin };
