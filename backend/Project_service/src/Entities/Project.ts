import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  managerId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  due_date: {
    type: Date,
    // validate: {
    //   validator: function (v: Date) {
    //     return v > this.start_date;
    //   },
    //   message: "Due date must be after start date",
    // },
  },
  status: {
    type: String,
    enum: ["pending", "in progress", "completed"],
    default: "pending",
  },
  task_ids: [
    {
      type: mongoose.Types.ObjectId,
    },
  ],
  budget: {
    type: Number,
    min: 0,
  },
  goal: {
    type: String,
    required: true,
  },
  document: {
    type: mongoose.Schema.Types.Mixed,
  },
});

export default projectSchema;
