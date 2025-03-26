import { model } from "mongoose";
import { messageSchema } from "../entities";

const Message = model("Message", messageSchema);

export default Message;
