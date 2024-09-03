import { Schema, model, Types } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  _id: { type: Types.ObjectId, default: () => new Types.ObjectId() },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
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
    set(value: string) {
      const saltRounds = 10; // Adjust the salt rounds as needed
      bcrypt.hash(value, saltRounds, (err, hash) => {
        if (err) {
          throw new Error("Error hashing password");
        }
        this.setDataValue("password", hash);
      });
    },
  },
  isBlocked: { type: Boolean, default: false },
  age: { type: Number, required: true, min: 0, max: 120 },
  phoneNumber: { type: Number, required: true, unique: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
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

export default model("User", userSchema);
