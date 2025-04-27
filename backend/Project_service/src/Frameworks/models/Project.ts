import mongoose from "mongoose";
import projectSchema from "../../Entities/Project";

const Project = mongoose.model("Project", projectSchema); // Note: Changed model name to "Project" (capital P)
export default Project;
