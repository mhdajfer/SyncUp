import mongoose from "mongoose";
import SubscriptionSchema from "../../entities/subscription.entiti";

const SubscriptionModel = mongoose.model("subscription", SubscriptionSchema);

export default SubscriptionModel;
