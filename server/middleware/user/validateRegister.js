const validateRegistration = (req, res, next) => {
  const {
    firstName,
    lastName,
    nameWithInitial,
    NIC,
    gender,
    dateOfBirth,
    address,
    workplace_id,
    email,
    contactNumber,
    password,
  } = req.body;

  // Log the incoming request body for debugging (comment this out in production)
  console.log("Registration Request Body:", req.body);

  // List of validation errors
  const errors = [];

  // Check if all required fields are provided
  if (!firstName) errors.push("First name is required");
  if (!lastName) errors.push("Last name is required");
  if (!nameWithInitial) errors.push("Name with initials is required");
  if (!NIC) errors.push("NIC is required");
  if (!gender) errors.push("Gender is required");
  if (!dateOfBirth) errors.push("Date of birth is required");
  if (!address) errors.push("Address is required");
  if (!workplace_id) errors.push("Workplace is required");
  if (!contactNumber) errors.push("Contact number is required");
  if (!password) errors.push("Password is required");

  // Additional format validations
  if (email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      errors.push("Invalid email format");
    }
  }

  if (NIC) {
    const nicRegex = /^[0-9]{9}[Vv]$|^[0-9]{12}$/; // Updated to handle new and old NIC formats
    if (!nicRegex.test(NIC)) {
      errors.push("Invalid NIC format");
    }
  }

  if (contactNumber) {
    const contactNumberRegex = /^[0-9]{10}$/;
    if (!contactNumberRegex.test(contactNumber)) {
      errors.push("Invalid contact number format (must be 10 digits)");
    }
  }

  if (password && password.length < 6) {
    errors.push("Password should be at least 6 characters long");
  }

  if (dateOfBirth) {
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      errors.push("Invalid date of birth");
    }
  }

  // If there are validation errors, return them as a response
  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation errors", errors: errors });
  }

  next();
};

module.exports = { validateRegistration };
