import mongoose from "mongoose";
import { userSchema } from "../../entities";

const User = mongoose.model("User", userSchema);

export default User;
