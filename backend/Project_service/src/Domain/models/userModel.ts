import mongoose from "mongoose";
import userSchema from "../Entities/user.entity";

const User = mongoose.model("User", userSchema);

export default User;
