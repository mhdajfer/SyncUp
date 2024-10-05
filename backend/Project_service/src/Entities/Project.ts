import { Schema, Types } from "mongoose";

const CommentSchema: Schema = new Schema({
  id: { type: Number, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: String, required: true },
});

const projectSchema = new Schema({
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
    type: Types.ObjectId,
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
      type: Types.ObjectId,
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
    type: Schema.Types.Mixed,
  },
  comments: { type: [CommentSchema], default: [] },
  created_by: {
    type: String,
  },
});

export default projectSchema;
