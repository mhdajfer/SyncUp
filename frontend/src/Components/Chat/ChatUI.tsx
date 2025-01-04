"use client";
import { useEffect, useRef, useState } from "react";
import { Send, File, X } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { ScrollArea } from "@/Components/ui/scroll-area";
import io, { Socket } from "socket.io-client";
import { Chat } from "@/interfaces/Chat";
import { User } from "@/interfaces/User";
import { Message } from "@/interfaces/Message";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getChats, sendMessage } from "@/api/Communication/chatApis";
import { AxiosError } from "axios";
import MessageSkeleton from "../Skeleton/MessageSkeleton";
import SingleChat from "./SingleChat";
import NoChatComponent from "./NoChatComponent";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import { getUploadUrl, uploadFileToS3 } from "@/lib/S3";

export default function ChatUI({ users }: { users: User[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentUserId = currentUser?._id;

  const viewportRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (viewportRef.current) {
        viewportRef.current.scrollIntoView({ behavior: "instant" });
      }
    }, 3000);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (document.getElementById("file-upload") instanceof HTMLInputElement) {
      (document.getElementById("file-upload") as HTMLInputElement).value = "";
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAllChats = async () => {
    try {
      const response = await getChats();
      console.log(response.data);

      if (response.success) setChats(response.data);
    } catch (error) {
      toast.error("can't fetch all chats");
      console.log(error);
    }
  };

  const END_POINT = "https://syncup.mhdajfer.in";
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(END_POINT, {
      path: "/comm/socket.io",
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    const chatIds = chats.map((chat) => chat._id);

    socketInstance.on("connect", () => {
      console.log("Connected to server:", socketInstance.id);
      socketInstance.emit("setup", chatIds);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Connection error:", err);
      toast.error("Socket connection failed");
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off("connect");
      socketInstance.off("connect_error");
      socketInstance.disconnect();
    };
  }, [END_POINT, chats]);

  useEffect(() => {
    if (!socket) return;
    const messageHandler = (newMessage: Message) => {
      const chat = newMessage.chat as Chat;
      const sender = newMessage.sender as User;

      setChats((prevChats) => {
        const updatedChats = prevChats.filter((c) => c._id !== chat._id);
        const updatedChat = {
          ...selectedChat,
          latestMessage: newMessage,
          updatedAt: new Date(),
        };
        return [updatedChat, ...updatedChats] as Chat[];
      });
      if (!selectedChat || selectedChat._id !== chat._id) {
        return toast.success(`New message from ${sender.firstName} `);
      } else {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("message received", messageHandler);
    return () => {
      socket.off("message received", messageHandler);
    };
  }, [selectedChat, socket]);

  useEffect(() => {
    if (!currentUserId) toast.error("Authenticated user not found");
    getAllChats();
  }, [currentUserId]);

  const handleSendMessage = async () => {
    try {
      if (newMessage.trim() !== "" || selectedFile) {
        if (!selectedChat?._id) return toast.error("Chat not selected");

        const newMsg: Message = {
          sender: currentUser || "",
          content: selectedFile ? "" : newMessage.trim(),
          chat: selectedChat?._id || "",
          file: selectedFile ? true : false,
        };

        const response = await sendMessage(
          selectedChat?._id,
          newMessage,
          selectedFile ? true : false
        );

        if (response.success && socket) {
          if (selectedFile) {
            const fileName = `Message-${response.data._id}.jpg`;
            const uploadResponse = await getUploadUrl(fileName, "image/jpeg");

            if (uploadResponse.success) {
              const { uploadUrl } = uploadResponse;

              if (!uploadUrl)
                return toast.error("didn't get url for the image upload");

              await uploadFileToS3(uploadUrl, selectedFile);
            }
          }

          setMessages([...messages, response.data ?? newMsg]);
          setNewMessage("");

          setSelectedFile(null);
          socket.emit("new message", response.data);
          setTimeout(scrollToBottom, 100);
        } else toast.error(response.message);

        setChats((prevChats) => {
          const updatedChats = prevChats.filter(
            (c) => c._id !== selectedChat._id
          );
          const updatedChat = {
            ...selectedChat,
            latestMessage: newMessage,
            updatedAt: new Date(),
          };
          return [updatedChat, ...updatedChats] as Chat[];
        });
      } else toast.warning("No message to send");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error);
      } else toast.error("error while sending message");
    }
  };

  return (
    <div className="flex h-screen  bg-gray-900 text-gray-100 w-full ms-[-1.5rem] mt-[-2.2rem] me-[-1.5rem] overflow-y-hidden">
      {/* Sidebar */}
      <ChatSidebar
        socket={socket}
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
        {selectedChat?.users &&
          selectedChat?.users.every((user) => typeof user === "object") && (
            <ChatHeader
              groupMembers={selectedChat.users}
              selectedChat={selectedChat}
              users={users}
              setSelectedChat={setSelectedChat}
            />
          )}

        {selectedChat && !isLoading ? (
          <ScrollArea className="flex-grow p-4 overflow-y-auto ">
            {messages.map((message) => (
              <div key={message._id}>
                <SingleChat
                  currentUserId={currentUserId}
                  message={message}
                  isGroup={selectedChat.isGroup}
                />
              </div>
            ))}
            <div ref={viewportRef}></div>
          </ScrollArea>
        ) : selectedChat && isLoading ? (
          <ScrollArea className="flex-grow p-4 overflow-y-auto ">
            <div className="flex flex-col space-y-8 p-10">
              <MessageSkeleton />
              <MessageSkeleton />
              <MessageSkeleton />
            </div>
          </ScrollArea>
        ) : (
          <NoChatComponent />
        )}

        {selectedChat && (
          <footer className="p-4 bg-gray-800 flex">
            <div>
              <label htmlFor="file-upload" className="cursor-pointer mr-2">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </Button>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/jpeg"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    console.log(e.target.files[0]);
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center w-full"
            >
              {!selectedFile ? (
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow w-full mr-2 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                />
              ) : (
                <div className="w-full rounded-md mr-2 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400">
                  <div className="flex items-center space-x-2">
                    <File className="h-8 w-8 text-primary" />
                    <span className="text-sm font-medium">
                      {selectedFile.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={clearFile}
                      className="rounded-full p-1 hover:bg-red-100"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              )}

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
