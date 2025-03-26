import mongoose, { Types } from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    chat: { type: String },
    isGroup: { type: Boolean, default: false },
    users: [{ type: Types.ObjectId, ref: "User" }],
    latestMessage: { type: Types.ObjectId, ref: "Message" },
    groupAdmin: { type: Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export default chatSchema;
