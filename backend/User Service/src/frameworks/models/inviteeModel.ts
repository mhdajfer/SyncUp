import { model } from "mongoose";
import inviteeSchema from "../../entities/invite.user";

inviteeSchema.index({ email: 1 }, { expireAfterSeconds: 1200 });

const Invitee = model("invitee", inviteeSchema);

export default Invitee;
