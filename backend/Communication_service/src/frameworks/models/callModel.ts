import mongoose from "mongoose";
import { CallSchema } from "../../entities";

const CallModel = mongoose.model("Call", CallSchema);

export default CallModel;
