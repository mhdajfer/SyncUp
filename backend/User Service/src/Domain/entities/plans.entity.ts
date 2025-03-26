import mongoose, { Schema, Document } from "mongoose";

const SubscriptionPlanSchema: Schema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default SubscriptionPlanSchema;
