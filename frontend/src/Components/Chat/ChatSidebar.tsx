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
import { useState } from "react";
import { User } from "@/interfaces/User";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Message } from "@/interfaces/Message";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { getMessages, getOneChat } from "@/api/Communication/chatApis";
import { format } from "date-fns";

export default function ChatSidebar({
  setChats,
  setIsLoading,
  setMessages,
  chats,
  users,
  setSelectedChat,
  selectedChat,
}: {
  chats: Chat[];
  users: User[];
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

  const handleOneChat = async (chat: Chat) => {
    try {
      if (!chat._id) return toast.error("chat not found");
      setSelectedChat(chat);

      console.log(selectedChat);

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

  return (
    <div>
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
                      key={user._id}
                      className="flex items-center p-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleStartChat(user)}
                    >
                      <Avatar className="mr-2">
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.avatar}`}
                          alt={user.avatar}
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
          {filteredChats.map((chat) => (
            <div
              key={chat._id}
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
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${chat.chat}`}
                    alt={chat.chat}
                  />
                  <AvatarFallback>{chat.chat[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <h3 className="font-semibold">{setChatName(chat)}</h3>
                  <p className="text-sm text-gray-400">
                    {chat.latestMessage?.content || "New Chat"}
                  </p>
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
    </div>
  );
}
