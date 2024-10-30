import { Schema, Types } from "mongoose";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

const userSchema = new Schema({
  _id: { type: ObjectId, default: () => new Types.ObjectId() },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (email: string) => {
        const emailRegex =
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return emailRegex.test(email);
      },
      message: "Invalid email format",
    },
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
    enum: ["manager", "dev", "pManager", "tenant-admin"],
    default: "tenant-admin",
  },
  tenant_id: {
    type: String,
  },
  avatar: {
    type: String,
  },
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const saltRounds = 10;
  bcrypt.hash(this.password, saltRounds, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
});

export default userSchema;
