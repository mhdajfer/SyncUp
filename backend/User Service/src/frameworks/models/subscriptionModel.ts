import mongoose from "mongoose";
import {SubscriptionSchema} from "../../entities";

const SubscriptionModel = mongoose.model("subscription", SubscriptionSchema);

export default SubscriptionModel;
