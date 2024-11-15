"use client";
import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { ScrollArea } from "@/Components/ui/scroll-area";

import { Chat } from "@/interfaces/Chat";
import { User } from "@/interfaces/User";
import { Message } from "@/interfaces/Message";
import { toast } from "sonner";
import { getAllUsers } from "@/api/userService/user";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getChats, sendMessage } from "@/api/Communication/chatApis";
import { AxiosError } from "axios";
import MessageSkeleton from "../Skeleton/Skeleton";
import SingleChat from "./SingleChat";
import NoChatComponent from "./NoChatComponent";
import ChatSidebar from "./ChatSidebar";

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [users, setUsers] = useState<User[]>([]);

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentUserId = currentUser?._id;

  const getUsers = async () => {
    try {
      const response = await getAllUsers();

      if (response.success) setUsers(response.data);
    } catch (error) {
      toast.error("can't fetch all users");
      console.log(error);
    }
  };

  const getAllChats = async () => {
    try {
      const response = await getChats();

      if (response.success) setChats(response.data);
    } catch (error) {
      toast.error("can't fetch all chats");
      console.log(error);
    }
  };

  useEffect(() => {
    if (!currentUserId) toast.error("Authenticated user not found");
    getUsers();
    getAllChats();
  }, [currentUserId]);

  const handleSendMessage = async () => {
    try {
      if (newMessage.trim() !== "") {
        if (!selectedChat?._id) return toast.error("Chat not selected");

        const newMsg: Message = {
          sender: currentUser || "",
          content: newMessage.trim(),
          chat: selectedChat?._id || "",
        };

        const response = await sendMessage(selectedChat?._id, newMessage);

        if (response.success) {
          setMessages([...messages, newMsg]);
          setNewMessage("");
        } else toast.error(response.message);
      } else toast.warning("No message to send");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error);
      } else toast.error("error while sending message");
    }
  };

  // const handleCreateGroup = () => {
  //   if (groupName.trim() !== "" && selectedParticipants.length > 0) {
  //     const newGroup: Chat = {
  //       id: chats.length + 1,
  //       name: groupName,
  //       lastMessage: "Group created",
  //       timestamp: new Date().toLocaleTimeString([], {
  //         hour: "2-digit",
  //         minute: "2-digit",
  //       }),
  //       isGroup: true,
  //     };
  //     setChats([newGroup, ...chats]);
  //     setIsCreateGroupOpen(false);
  //     setGroupName("");
  //     setSelectedParticipants([]);
  //   }
  // };

  return (
    <div className="flex h-screen  bg-gray-900 text-gray-100 w-full ms-[-1.5rem] mt-[-2.2rem] me-[-1.5rem] overflow-y-hidden">
      {/* Sidebar */}
      <ChatSidebar
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        chats={chats}
        setChats={setChats}
        setIsLoading={setIsLoading}
        setMessages={setMessages}
        users={users}
      />

      {/* Chat Area */}
      <div className="flex-grow flex flex-col">
        <header className="px-4 py-3 bg-gray-800">
          <h1 className="text-xl font-bold">Chat Interface</h1>
        </header>

        {selectedChat ? (
          <ScrollArea className="flex-grow p-4">
            {isLoading ? (
              <div className="flex flex-col space-y-8 p-10">
                <MessageSkeleton />
                <MessageSkeleton />
                <MessageSkeleton />
              </div>
            ) : (
              messages.map((message) => (
                <div key={message._id}>
                  <SingleChat currentUserId={currentUserId} message={message} />
                </div>
              ))
            )}
          </ScrollArea>
        ) : (
          <NoChatComponent />
        )}

        {selectedChat && (
          <footer className="p-4 bg-gray-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center"
            >
              <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow mr-2 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
              />
              <Button type="submit" size="icon" variant="secondary">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </footer>
        )}
      </div>
    </div>
  );
}
