import { model } from "mongoose";
import inviteeSchema from "../../entities/invite.user";

const Invitee = model("invitee", inviteeSchema);

export default Invitee;
