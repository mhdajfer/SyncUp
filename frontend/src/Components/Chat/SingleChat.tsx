"use client";
import { Message } from "@/interfaces/Message";
import { User } from "@/interfaces/User";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { format } from "date-fns";

export default function SingleChat({
  message,
  currentUserId,
  isGroup,
}: {
  message: Message;
  currentUserId: string | undefined;
  isGroup: boolean;
}) {
  const sender: User = message.sender as User;
  const isCurrentUser = sender._id === currentUserId;

  return (
    <div
      className={`flex items-start mb-4 ${isCurrentUser ? "justify-end" : ""}`}
    >
      {!isCurrentUser && (
        <Avatar className="mr-2">
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${sender._id}`}
            alt={`Avatar of ${sender.firstName}`}
          />
          <AvatarFallback>
            {sender.firstName ? sender.firstName[0] : "?"}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`rounded-lg p-3 max-w-[80%] ${
          isCurrentUser ? "bg-blue-600" : "bg-gray-700"
        }`}
      >
        {isGroup && !isCurrentUser && (
          <p className="font-medium mb-1 text-sm text-gray-300">
            {sender.firstName || "Unknown User"}
          </p>
        )}
        <p>{message.content}</p>
        {message.updatedAt && (
          <p className="text-xs text-gray-400 mt-1">
            {format(new Date(message.updatedAt), "PPpp")}
          </p>
        )}
      </div>
      {isCurrentUser && (
        <Avatar className="ml-2">
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${sender._id}`}
            alt={`Avatar of ${sender.firstName}`}
          />
          <AvatarFallback>
            {sender.firstName ? sender.firstName[0] : "?"}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
