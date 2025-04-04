import { Schema, Types } from "mongoose";

const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  assignee: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  projectId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Feature", "Bug", "Testing", "Planning"],
  },
  priority: {
    type: String,
    enum: ["high", "medium", "low"],
    default: "low",
  },
  status: {
    type: String,
    enum: ["pending", "in progress", "completed"],
    default: "pending",
  },
  remarks: {
    type: String,
  },
  start_date: {
    type: Date,
    required: true,
  },
  due_date: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  log_time: {
    start_time: Date,
    stop_time: Date,
    total_time: {
      type: Number,
      default: 0,
    },
  },
  comments: [
    {
      author: { type: Types.ObjectId, required: true, ref: "User" },
      content: { type: String, required: true },
      timeStamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

TaskSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default TaskSchema;
