import mongoose from "mongoose";
import TaskSchema from "../../Entities/Tasks";

const taskModel = mongoose.model("task", TaskSchema);

export default taskModel;
