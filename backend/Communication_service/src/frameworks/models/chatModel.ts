import { model } from "mongoose";
import chatSchema from "../../entities/chat.entity";


const Chat = model('Chat', chatSchema);

export default Chat;