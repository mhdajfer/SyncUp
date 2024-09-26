import { Schema } from "express-validator";

export default (): Schema => {
  return {
    company_name: {
      trim: true,
      notEmpty: {
        errorMessage: "Company name cannot be empty",
      },
      isString: {
        errorMessage: "Company name must be a string",
      },
      isLength: {
        options: { min: 3 },
        errorMessage: "Company name must contain at least 3 letters",
      },
      matches: {
        options: /^[A-Za-z ]+$/,
        errorMessage:
          "Company name must not contain special characters or digits",
      },
    },
    company_type: {
      trim: true,
      notEmpty: {
        errorMessage: "Company type cannot be empty",
      },
      isString: {
        errorMessage: "Company type must be a string",
      },
      isLength: {
        options: { min: 3 },
        errorMessage: "Company type must contain at least 3 letters",
      },
      matches: {
        options: /^[A-Za-z ]+$/,
        errorMessage:
          "Company type must not contain special characters or digits",
      },
    },
    "address.building_no": {
      trim: true,
      notEmpty: {
        errorMessage: "Building number cannot be empty",
      },
      isString: {
        errorMessage: "Building number must be a string",
      },
      isLength: {
        options: { min: 2 },
        errorMessage: "Building number must contain at least 2 characters",
      },
      matches: {
        options: /^[0-9]+$/,
        errorMessage: "Building number must contain only digits",
      },
    },
    "address.city": {
      trim: true,
      notEmpty: {
        errorMessage: "City cannot be empty",
      },
      isString: {
        errorMessage: "City must be a string",
      },
      isLength: {
        options: { min: 3 },
        errorMessage: "City must contain at least 3 letters",
      },
      matches: {
        options: /^[A-Za-z ]+$/,
        errorMessage: "City must not contain special characters or digits",
      },
    },
    "address.country": {
      trim: true,
      notEmpty: {
        errorMessage: "Country cannot be empty",
      },
      isString: {
        errorMessage: "Country must be a string",
      },
      isLength: {
        options: { min: 3 },
        errorMessage: "Country must contain at least 3 letters",
      },
      matches: {
        options: /^[A-Za-z ]+$/,
        errorMessage: "Country must not contain special characters or digits",
      },
    },
    "address.postal_code": {
      trim: true,
      notEmpty: {
        errorMessage: "Postal code cannot be empty",
      },
      isString: {
        errorMessage: "Postal code must be a string",
      },
      isLength: {
        options: { min: 6, max: 6 },
        errorMessage: "Postal code must contain exactly 6 digits",
      },
      matches: {
        options: /^[0-9]+$/,
        errorMessage: "Postal code must contain only digits",
      },
    },
    "address.state": {
      trim: true,
      notEmpty: {
        errorMessage: "State cannot be empty",
      },
      isString: {
        errorMessage: "State must be a string",
      },
      isLength: {
        options: { min: 3 },
        errorMessage: "State must contain at least 3 letters",
      },
      matches: {
        options: /^[A-Za-z ]+$/,
        errorMessage: "State must not contain special characters or digits",
      },
    },
    "address.street": {
      trim: true,
      notEmpty: {
        errorMessage: "Street cannot be empty",
      },
      isString: {
        errorMessage: "Street must be a string",
      },
      isLength: {
        options: { min: 3 },
        errorMessage: "Street must contain at least 3 letters",
      },
      matches: {
        options: /^[A-Za-z ]+$/,
        errorMessage: "Street must not contain special characters or digits",
      },
    },
    phone_no: {
      trim: true,
      notEmpty: {
        errorMessage: "Phone number cannot be empty",
      },
      isString: {
        errorMessage: "Phone number must be a string",
      },
      matches: {
        options: /^[0-9]{10}$/,
        errorMessage: "Phone number must contain exactly 10 digits",
      },
    },
    domain: {
      optional: true,
      trim: true,
      isString: {
        errorMessage: "Domain must be a string",
      },
      isURL: {
        errorMessage: "Domain must be a valid URL",
      },
    },
  };
};
