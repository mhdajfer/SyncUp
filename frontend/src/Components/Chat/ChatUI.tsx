"use client";
import { useEffect, useState } from "react";
import { Send, Search, Plus, X } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Chat } from "@/interfaces/Chat";
import { User } from "@/interfaces/User";
import { Message } from "@/interfaces/Message";
import { toast } from "sonner";
import { getAllUsers } from "@/api/userService/user";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  getChats,
  getMessages,
  getOneChat,
  sendMessage,
} from "@/api/Communication/chatApis";
import { format } from "date-fns";
import { AxiosError } from "axios";
import MessageSkeleton from "../Skeleton/Skeleton";
import SingleChat from "./SingleChat";

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
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

  // const getMessages = async () =>{
  //   try{
  //     const

  //   }catch(error){
  //     toast.error("can't fetch all messages");
  //     console.log(error);
  //   }
  // }

  useEffect(() => {
    if (!currentUserId) toast.error("Authenticated user not found");
    getUsers();
    getAllChats();
  }, [currentUserId]);

  const handleOneChat = async (chat: Chat) => {
    try {
      if (!chat._id) return toast.error("chat not found");
      setSelectedChat(chat);

      const response = await getMessages(chat._id);

      if (response.success) {
        setMessages(response.data);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error);
      } else toast.error("error while getting messages");
    }
  };

  const handleSendMessage = async () => {
    try {
      if (newMessage.trim() !== "") {
        if (!chats[0]._id) return toast.error("Chat not selected");

        const newMsg: Message = {
          sender: currentUser || "",
          content: newMessage.trim(),
          chat: chats[0]._id || "",
        };

        const response = await sendMessage(chats[0]._id, newMessage);

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

  const handleCreateGroup = () => {
    if (groupName.trim() !== "" && selectedParticipants.length > 0) {
      const newGroup: Chat = {
        _id: (chats.length + 1).toString(),
        isGroup: true,
        users: selectedParticipants,
        chat: groupName,
        lastMessage: {} as Message,
        isGroupAdmin: true,
      };
      setChats([newGroup, ...chats]);
      setIsCreateGroupOpen(false);
      setGroupName("");
      setSelectedParticipants([]);
    }
  };

  const setChatName = (chat: Chat) => {
    const otherUser = chat.users.find((user) =>
      typeof user !== "string"
        ? user._id !== currentUserId
        : user !== currentUserId
    );

    if (!otherUser) return toast.error("Issue with chat name");

    return typeof otherUser === "object" ? otherUser.firstName : otherUser;
  };

  const filteredChats = chats.filter((chat) =>
    chat.chat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen  bg-gray-900 text-gray-100 w-full ms-[-1.5rem] mt-[-2.2rem] me-[-1.5rem] overflow-y-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
          />
        </div>
        <ScrollArea className="flex-grow">
          {filteredChats.map((chat) => (
            <div
              key={chat._id}
              className={`p-4 border-b border-gray-800 hover:bg-gray-800 cursor-pointer ${
                selectedChat == chat ? "bg-blue-600" : ""
              }`}
              onClick={() => {
                handleOneChat(chat);
              }}
            >
              <div className="flex items-center">
                <Avatar className="mr-3">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${chat.chat}`}
                    alt={chat.chat}
                  />
                  <AvatarFallback>{chat.chat[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <h3 className="font-semibold">{setChatName(chat)}</h3>
                  <p className="text-sm text-gray-400">dummy message</p>
                </div>
                {chat.updatedAt && (
                  <span className="text-xs text-gray-500">
                    {format(chat.updatedAt, "PPpp")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="p-4 border-t border-gray-800">
          <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-gray-100">
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input
                    id="group-name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>
                <div>
                  <Label>Select Participants</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {users.map((user) => (
                      <Button
                        key={user._id}
                        variant={
                          selectedParticipants.includes(user)
                            ? "secondary"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          setSelectedParticipants((prev) =>
                            prev.includes(user)
                              ? prev.filter((p) => p._id !== user._id)
                              : [...prev, user]
                          );
                        }}
                      >
                        {user.firstName}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button onClick={handleCreateGroup} className="w-full">
                  Create Group
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow flex flex-col">
        <header className="px-4 py-3 bg-gray-800">
          <h1 className="text-xl font-bold">Chat Interface</h1>
        </header>

        <ScrollArea className="flex-grow p-4">
          {isLoading ? (
            <>
              <MessageSkeleton />
              <MessageSkeleton />
              <MessageSkeleton />
            </>
          ) : (
            messages.map((message) => (
              <div key={message._id}>
                <SingleChat currentUserId={currentUserId} message={message} />
              </div>
            ))
          )}
        </ScrollArea>

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
      </div>
    </div>
  );
}
