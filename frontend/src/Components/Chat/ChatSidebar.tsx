import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Chat } from "@/interfaces/Chat";
import { useEffect, useState } from "react";
import { User } from "@/interfaces/User";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Message } from "@/interfaces/Message";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  createGroup,
  getMessages,
  getOneChat,
} from "@/api/Communication/chatApis";
import { format } from "date-fns";
import { Socket } from "socket.io-client";
import MessageSkeleton from "../Skeleton/MessageSkeleton";
import { S3_URL } from "@/Consts";

export default function ChatSidebar({
  setChats,
  setIsLoading,
  setMessages,
  chats,
  users,
  setSelectedChat,
  selectedChat,
  socket,
}: {
  chats: Chat[];
  users: User[];
  socket: Socket | null;
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat) => void;
  setChats: (chats: Chat[]) => void;
  setIsLoading: (val: boolean) => void;
  setMessages: (messages: Message[]) => void;
}) {
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(true);
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentUserId = currentUser?._id;

  const handleStartChat = async (user: User) => {
    try {
      const response = await getOneChat(user._id || "");

      if (response.success) {
        setChats([...chats, response.data]);
        setIsAddUserOpen(false);
        handleOneChat(response.data);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error);
      } else toast.error("error while getting messages");
    }
  };
  const handleCreateGroup = async () => {
    if (groupName.trim() !== "" && selectedParticipants.length > 0) {
      const newGroup: Chat = {
        _id: (chats.length + 1).toString(),
        isGroup: true,
        users: selectedParticipants,
        chat: groupName,
        latestMessage: {
          content: "Group created",
          sender: "currentUser",
          chat: "currentChat",
        } as Message,
        groupAdmin: currentUser,
      };
      console.log(groupName, selectedParticipants);

      try {
        const response = await createGroup(groupName, selectedParticipants);

        if (response.success) {
          toast.success(response.message);

          setChats([newGroup, ...chats]);
          setIsCreateGroupOpen(false);
          setGroupName("");
          setSelectedParticipants([]);
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.error);
        } else toast.error("error while getting messages");
      }
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

  // const setChatImage = (chat: Chat) => {
  //   const otherUser = chat.users.find((user) =>
  //     typeof user !== "string"
  //       ? user._id !== currentUserId
  //       : user !== currentUserId
  //   );

  //   if (!otherUser) return toast.error("Issue with chat name");

  //   return typeof otherUser === "object" ? otherUser.avatar : otherUser;
  // };

  const handleOneChat = async (chat: Chat) => {
    try {
      setIsLoading(true);
      if (!chat._id) return toast.error("chat not found");
      setSelectedChat(chat);

      const response = await getMessages(chat._id);

      if (response.success) {
        setMessages(response.data);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);

        socket?.emit("join room", chat._id);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error);
      } else toast.error("error while getting messages");
    }
  };

  const getOtherUserId = (users: User[] | string[]) => {
    if (typeof users[0] === "object") {
      if (users[0]._id === currentUserId)
        return (users[1] as User)._id as string;
      else return (users[0] as User)._id as string;
    }
    // If users is an array of strings, return the first element
    if (users[0] === currentUserId) return users[1] as string;
    else return users[0] as string;
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.firstName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchQuery.toLowerCase())) &&
      user._id !== currentUserId
  );

  const filteredChats = chats.filter((chat) => {
    const otherUser = chat.users.find((user) =>
      typeof user !== "string"
        ? user._id !== currentUserId
        : user !== currentUserId
    );

    if (!otherUser) return toast.error("Issue with chat name");

    const otherUserName =
      typeof otherUser === "object" ? otherUser.firstName : otherUser;
    return otherUserName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    setTimeout(() => {
      setIsChatLoading(false);
    }, 1000);
  }, [setIsLoading]);

  return (
    <>
      <div className="w-80 border-r border-gray-800 flex flex-col h-full">
        <div className="p-4 border-b border-gray-800 flex">
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
          />
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" className="ml-2">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add new chat</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-gray-100">
              <DialogHeader>
                <DialogTitle>Start a New Chat</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="user-search">Search Users</Label>
                  <Input
                    id="user-search"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search by name or email"
                    className="bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>
                <ScrollArea className="h-[200px]">
                  {filteredUsers.map((user) => (
                    <div
                      key={user._id || "h"}
                      className="flex items-center p-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleStartChat(user)}
                    >
                      <Avatar className="mr-2 bg-violet-900">
                        <AvatarImage
                          src={`${S3_URL}/Image-${user._id}.jpg`}
                          alt={user.firstName[0]}
                        />
                        <AvatarFallback>{user.firstName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.firstName}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <ScrollArea className="flex-grow">
          {isChatLoading ? (
            <div className="mx-1 mt-5 ms-5">
              <MessageSkeleton />
              <MessageSkeleton />
              <MessageSkeleton />
              <MessageSkeleton />
              <MessageSkeleton />
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat._id || "h"}
                className={`p-4 border-b border-gray-800 hover:bg-gray-800 cursor-pointer ${
                  selectedChat == chat ? "bg-gray-800 hover:bg-gray-800" : ""
                }`}
                onClick={() => {
                  handleOneChat(chat);
                }}
              >
                <div className="flex items-center">
                  <Avatar className="mr-3">
                    <AvatarImage
                      src={
                        chat.isGroup
                          ? ""
                          : `${S3_URL}/Image-${getOtherUserId(chat.users)}.jpg`
                      }
                    />
                    <AvatarFallback className="bg-orange-400">
                      {chat.isGroup ? chat.chat : setChatName(chat)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <h3 className="font-semibold">
                      {chat.isGroup ? chat.chat : setChatName(chat)}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {chat.latestMessage
                        ? chat.latestMessage.file
                          ? "📎 Image"
                          : chat.latestMessage.content || "No message"
                        : "No message"}
                    </p>
                  </div>
                  {chat.updatedAt && (
                    <span className="text-xs text-gray-500">
                      {format(chat.updatedAt, "PPpp")}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </ScrollArea>
        <div className="p-4 border-t border-gray-800">
          <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full bg-violet-950 border-gray-700 text-neutral-400 hover:bg-violet-950 hover:text-white cursor-pointer "
                variant="outline"
              >
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
                        key={user._id || "h"}
                        className={
                          selectedParticipants.includes(user)
                            ? "bg-green-700 hover:bg-green-800"
                            : "bg-blue-950 border border-gray-700 hover:bg-blue-900"
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
    </>
  );
}
