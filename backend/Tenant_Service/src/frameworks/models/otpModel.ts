import { model } from "mongoose";
import otpSchema from "../../entities/user.otp";

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

const Otp = model("Otp", otpSchema);

export default Otp;
