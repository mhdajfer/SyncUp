import mongoose from "mongoose";
import {SubscriptionPlanSchema} from "../../entities";

const SubscriptionPlanModel = mongoose.model(
  "subscriptionplan",
  SubscriptionPlanSchema
);

export default SubscriptionPlanModel;
