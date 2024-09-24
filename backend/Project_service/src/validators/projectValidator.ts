import { Schema } from "express-validator";

export default (): Schema => {
  return {
    name: {
      trim: true,
      notEmpty: {
        errorMessage: "Name is required",
      },
      isLength: {
        options: { min: 5 },
        errorMessage: "Name must be at least 5 characters",
      },
    },
    description: {
      trim: true,
      notEmpty: {
        errorMessage: "Description is required",
      },
      isLength: {
        options: { min: 5, max: 100 },
        errorMessage: "Description must be between 5 and 100 characters",
      },
    },
    managerId: {
      notEmpty: {
        errorMessage: "Manager ID is required",
      },
    },
    start_date: {
      notEmpty: {
        errorMessage: "Start date is required",
      },
      isISO8601: {
        errorMessage: "Invalid start date format",
      },
      toDate: true, 
    },
    due_date: {
      notEmpty: {
        errorMessage: "Due date is required",
      },
      isISO8601: {
        errorMessage: "Invalid due date format",
      },
      toDate: true, 
      custom: {
        options: (due_date, { req }) => {
          const startDate = new Date(req.body.start_date);
          const dueDate = new Date(due_date);
          if (dueDate < startDate) {
            throw new Error("Due date cannot be earlier than start date");
          }
          return true;
        },
      },
    },
    status: {
      notEmpty: {
        errorMessage: "Status is required",
      },
      isIn: {
        options: [["pending", "in progress", "completed"]],
        errorMessage: "Invalid status value",
      },
    },
    budget: {
      notEmpty: {
        errorMessage: "Budget is required",
      },
      isFloat: {
        options: { min: 0 },
        errorMessage: "Budget must be a positive number",
      },
      toFloat: true, 
    },
    goal: {
      trim: true,
      notEmpty: {
        errorMessage: "Goal is required",
      },
    },
    document: {
      optional: true, 
    },
  };
};
