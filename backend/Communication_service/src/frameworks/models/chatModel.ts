import { model } from "mongoose";
import { chatSchema } from "../../entities";

const Chat = model("Chat", chatSchema);

export default Chat;
