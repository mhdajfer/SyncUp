"use client";
import { useState } from "react";
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

type Message = {
  id: number;
  user: string;
  content: string;
  timestamp: string;
};

type Chat = {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  isGroup: boolean;
};

type User = {
  id: number;
  name: string;
};

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      user: "Alice",
      content: "Hey there! How's it going?",
      timestamp: "2:30 PM",
    },
    {
      id: 2,
      user: "Bob",
      content: "Hi Alice! I'm doing great, thanks for asking. How about you?",
      timestamp: "2:31 PM",
    },
    {
      id: 3,
      user: "Alice",
      content:
        "I'm doing well too! Just working on some new projects. Anything exciting on your end?",
      timestamp: "2:33 PM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      name: "Alice",
      lastMessage: "Hey there! How's it going?",
      timestamp: "2:30 PM",
      isGroup: false,
    },
    {
      id: 2,
      name: "Project Team",
      lastMessage: "Meeting at 3 PM",
      timestamp: "1:45 PM",
      isGroup: true,
    },
    {
      id: 3,
      name: "Bob",
      lastMessage: "Can you send me the report?",
      timestamp: "Yesterday",
      isGroup: false,
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);

  const users: User[] = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
    { id: 4, name: "David" },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const newMsg: Message = {
        id: messages.length + 1,
        user: "You",
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  const handleCreateGroup = () => {
    if (groupName.trim() !== "" && selectedParticipants.length > 0) {
      const newGroup: Chat = {
        id: chats.length + 1,
        name: groupName,
        lastMessage: "Group created",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isGroup: true,
      };
      setChats([newGroup, ...chats]);
      setIsCreateGroupOpen(false);
      setGroupName("");
      setSelectedParticipants([]);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
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
              key={chat.id}
              className="p-4 border-b border-gray-800 hover:bg-gray-800 cursor-pointer"
            >
              <div className="flex items-center">
                <Avatar className="mr-3">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${chat.name}`}
                    alt={chat.name}
                  />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <h3 className="font-semibold">{chat.name}</h3>
                  <p className="text-sm text-gray-400">{chat.lastMessage}</p>
                </div>
                <span className="text-xs text-gray-500">{chat.timestamp}</span>
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
                        key={user.id}
                        variant={
                          selectedParticipants.includes(user)
                            ? "secondary"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          setSelectedParticipants((prev) =>
                            prev.includes(user)
                              ? prev.filter((p) => p.id !== user.id)
                              : [...prev, user]
                          );
                        }}
                      >
                        {user.name}
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
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start mb-4 ${
                message.user === "You" ? "justify-end" : ""
              }`}
            >
              {message.user !== "You" && (
                <Avatar className="mr-2">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.user}`}
                    alt={message.user}
                  />
                  <AvatarFallback>{message.user[0]}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.user === "You" ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                <p className="font-medium mb-1">{message.user}</p>
                <p>{message.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {message.timestamp}
                </p>
              </div>
              {message.user === "You" && (
                <Avatar className="ml-2">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.user}`}
                    alt={message.user}
                  />
                  <AvatarFallback>{message.user[0]}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
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
