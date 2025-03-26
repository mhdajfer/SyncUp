import mongoose from "mongoose";
import projectSchema from "../Entities/Project";

const Project = mongoose.model("project", projectSchema);
export default Project;
