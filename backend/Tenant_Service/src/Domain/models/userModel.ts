import mongoose from "mongoose";
import userSchema from "../entities/user.entity";

const User = mongoose.model("User", userSchema);

export default User;
