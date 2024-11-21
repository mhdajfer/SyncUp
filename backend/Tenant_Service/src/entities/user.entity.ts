import { Schema, Types } from "mongoose";
import { ObjectId } from "mongodb";

const userSchema = new Schema({
  _id: { type: ObjectId, default: () => new Types.ObjectId() },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isBlocked: { type: Boolean, default: false },
  age: { type: Number, min: 0, max: 120 },
  isVerified: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  phoneNumber: { type: Number },
  role: {
    type: String,
    enum: ["manager", "dev", "pManager", "tenant-admin", "sAdmin"],
    default: "tenant-admin",
  },
  tenant_id: {
    type: String,
  },
});

export default userSchema;
