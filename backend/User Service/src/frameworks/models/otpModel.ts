import { model } from "mongoose";
import {otpSchema} from "../../entities";

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

const Otp = model("Otp", otpSchema);

export default Otp;
