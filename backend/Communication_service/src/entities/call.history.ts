import { Schema, Types } from "mongoose";

const CallSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
    },
    otherUserId: {
      type: Types.ObjectId,
      ref: "User",
    },
    startTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["completed", "missed", "ongoing"],
    },
    type: {
      type: String,
      enum: ["incoming", "outgoing"],
    },
  },
  {
    timestamps: true,
  }
);

export default CallSchema;
