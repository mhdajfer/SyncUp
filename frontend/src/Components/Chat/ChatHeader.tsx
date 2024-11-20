"use client";

import { useState } from "react";
import {
  MoreVertical,
  UserPlus,
  UserMinus,
  Settings,
  LogOut,
  Users,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Chat } from "@/interfaces/Chat";
import { User } from "@/interfaces/User";
import { Label } from "../ui/label";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { addMemberToGroup } from "@/api/Communication/chatApis";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function ChatHeader({
  selectedChat,
  groupMembers,
  setSelectedChat,
  users,
}: {
  selectedChat: Chat;
  setSelectedChat: (data: Chat) => void;
  users: User[];
  groupMembers: User[];
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newMembers, setNewMembers] = useState<User[]>([]);

  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);

  const addNewMembers = async () => {
    try {
      if (!currentUserId || selectedChat.groupAdmin?._id !== currentUserId) {
        setNewMembers([]);
        return toast.error("You are not allowed do this.!!");
      }
      if (!selectedChat._id) return toast.error("Chat not selected");

      const response = await addMemberToGroup(newMembers, selectedChat._id);

      if (response.success) {
        toast.success(response.message);
        setNewMembers([]);
        setIsAddUserOpen(false);
        setSelectedChat(response.data as Chat);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error);
      } else toast.error("error while getting messages");
    }
  };

  return (
    <header className="px-4 py-3 bg-gray-800 flex items-center">
      <h1 className="text-xl font-bold text-white">Chat Interface</h1>
      {selectedChat?.isGroup && (
        <>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="ms-auto text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full transition-colors duration-200"
              >
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-gray-800 text-gray-100 border border-gray-700 rounded-md shadow-lg"
            >
              <DropdownMenuItem
                className="hover:bg-gray-700 focus:bg-gray-700 focus:outline-none rounded-sm transition-colors duration-200"
                onSelect={() => {
                  setIsMembersDialogOpen(true);
                  setIsDropdownOpen(false);
                }}
              >
                <Users className="mr-2 h-4 w-4" />
                <span>See members</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-gray-700 focus:bg-gray-700 focus:outline-none rounded-sm transition-colors duration-200"
                onSelect={() => {
                  setIsAddUserOpen(true);
                  setIsDropdownOpen(false);
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Add member</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 focus:outline-none rounded-sm transition-colors duration-200">
                <Settings className="mr-2 h-4 w-4" />
                <span>Group settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 focus:outline-none rounded-sm text-red-400 hover:text-red-300 transition-colors duration-200">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Leave group</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog
            open={isMembersDialogOpen}
            onOpenChange={setIsMembersDialogOpen}
          >
            <DialogContent className="sm:max-w-[425px] bg-gray-900 text-gray-100 border border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-gray-100">
                  Group Members
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  View and manage members of this group chat.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="mt-4 max-h-[60vh]">
                <div className="space-y-4">
                  {groupMembers.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage
                            src={member.avatar}
                            alt={member.firstName}
                          />
                          <AvatarFallback className="bg-gray-700 text-gray-100">
                            {member.firstName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none text-gray-100">
                            {member.firstName}
                          </p>
                          <p className="text-sm text-gray-400">{member.role}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-gray-800 text-gray-100 border border-gray-700"
                        >
                          <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">
                            <UserMinus className="mr-2 h-4 w-4" />
                            <span>Remove from group</span>
                          </DropdownMenuItem>
                          {member.role !== "Admin" && (
                            <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">
                              <UserPlus className="mr-2 h-4 w-4" />
                              <span>Make admin</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsMembersDialogOpen(false)}
                  className="bg-gray-800 text-gray-100 hover:bg-gray-700 hover:text-white border-gray-700"
                >
                  Close
                </Button>
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setIsAddUserOpen(true)}
                >
                  Add Member
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogContent>
              <div>
                <Label>Select Participants</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {users.map((user: User) => (
                    <Button
                      key={user._id || "h"}
                      className={
                        groupMembers.some(
                          (member) => member._id === user._id
                        ) ||
                        newMembers.some((member) => member._id === user._id)
                          ? "bg-green-700 hover:bg-green-800"
                          : "bg-blue-950 border border-gray-700 hover:bg-blue-900"
                      }
                      size="sm"
                      onClick={() => {
                        setNewMembers((prev) =>
                          prev.includes(user)
                            ? prev.filter((p) => p._id !== user._id)
                            : [...prev, user]
                        );

                        console.log(newMembers);
                      }}
                    >
                      {user.firstName}
                    </Button>
                  ))}
                </div>
                <Button
                  className="bg-violet-950 text-neutral-200 hover:bg-violet-900 mt-4"
                  onClick={addNewMembers}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </header>
  );
}
