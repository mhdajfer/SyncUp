import { model } from "mongoose";
import messageSchema from "../../entities/message.entity";


const Message = model('Message', messageSchema);

export default Message;