import { Schema } from "express-validator";

export default (): Schema => {
  return {
    firstName: {
      trim: true,
      notEmpty: {
        errorMessage: "First Name is required",
      },
      isAlpha: {
        errorMessage: "First Name should contain only alphabets",
      },
    },
    lastName: {
      trim: true,
      notEmpty: {
        errorMessage: "Last Name is required",
      },
      isAlpha: {
        errorMessage: "Last Name should contain only alphabets",
      },
    },
    email: {
      isEmail: {
        errorMessage: "Invalid email format",
      },
      normalizeEmail: true,
    },
    password: {
      notEmpty: {
        errorMessage: "Password is required",
      },
      isLength: {
        options: { min: 6 },
        errorMessage: "Password should be at least 6 characters long",
      },
    },
    isBlocked: {
      isBoolean: {
        errorMessage: "isBlocked must be a boolean value",
      },
      optional: true,
    },
    age: {
      isInt: {
        options: { min: 0, max: 120 },
        errorMessage: "Age must be an integer between 0 and 120",
      },
    },
    phoneNumber: {
      isMobilePhone: {
        errorMessage: "Invalid phone number format",
      },
    },
    role: {
      isIn: {
        options: [["admin", "user"]],
        errorMessage: "Role must be either admin or user",
      },
    },
  };
};
