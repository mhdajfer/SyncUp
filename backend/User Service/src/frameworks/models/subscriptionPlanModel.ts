import mongoose from "mongoose";
import SubscriptionPlanSchema from "../../entities/plans.entity";

const SubscriptionPlanModel = mongoose.model(
  "subscriptionplan",
  SubscriptionPlanSchema
);

export default SubscriptionPlanModel;
