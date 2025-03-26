import mongoose, { Schema, Document } from "mongoose";

const SubscriptionSchema: Schema = new Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ["subscribe", "renew", "cancel"],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    orgName: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default SubscriptionSchema;
