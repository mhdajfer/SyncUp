import { Schema, Types } from "mongoose";

const messageSchema = new Schema(
  {
    sender: { type: Types.ObjectId, ref: "User" },
    content: { type: String },
    chat: { type: Types.ObjectId, ref: "Chat" },
  },
  {
    timestamps: true,
  }
);


export default messageSchema;
