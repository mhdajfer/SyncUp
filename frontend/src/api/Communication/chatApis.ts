import { userInstance } from "@/axios";
import { Chat } from "@/interfaces/Chat";
import { Message } from "@/interfaces/Message";

interface Response {
  message: string;
  data: Chat[];
  success: boolean;
}

export const getChats = async () => {
  try {
    const response = await userInstance.get("/comm/chats/allChat");

    return response.data as Response;
  } catch (error) {
    console.log("error while getting all chats");
    throw error;
  }
};

export const sendMessage = async (chatId: string, content: string) => {
  try {
    const response = await userInstance.post("/comm/chats/sendMessage", {
      chatId,
      content,
    });

    return response.data as Response & { data: Message };
  } catch (error) {
    console.log("error while getting all chats");
    throw error;
  }
};

export const getOneChat = async (receiverId: string) => {
  try {
    const response = await userInstance.post("/comm/chats/getChat", {
      userId: receiverId,
    });

    return response.data as Response & { data: Chat };
  } catch (error) {
    throw error;
  }
};

export const getMessages = async (chatId: string) => {
  try {
    const response = await userInstance.post("/comm/chats/getMessages", {
      chatId,
    });

    return response.data as Response & { data: Message[] };
  } catch (error) {
    throw error;
  }
};
