import { userInstance } from "@/axios";
import { Chat } from "@/interfaces/Chat";
import { Message } from "@/interfaces/Message";
import { User } from "@/interfaces/User";

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

export const sendMessage = async (
  chatId: string,
  content: string,
  file?: boolean
) => {
  try {
    const response = await userInstance.post("/comm/chats/sendMessage", {
      chatId,
      content,
      file,
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

export const createGroup = async (groupName: string, users: User[]) => {
  try {
    const response = await userInstance.post("/comm/chats/group", {
      groupName,
      users,
    });

    return response.data as Response & { data: Chat };
  } catch (error) {
    throw error;
  }
};

export const addMemberToGroup = async (users: User[], chatId: string) => {
  try {
    const response = await userInstance.post("/comm/chats/group/member/add", {
      users,
      chatId,
    });

    return response.data as Response & { data: Chat };
  } catch (error) {
    throw error;
  }
};

export const removeMember = async (userId: string, chatId: string) => {
  try {
    const response = await userInstance.post(
      "/comm/chats/group/member/remove",
      {
        userId,
        chatId,
      }
    );

    return response.data as Response & { data: Chat };
  } catch (error) {
    throw error;
  }
};
