"use client";
import { Message } from "@/interfaces/Message";
import { User } from "@/interfaces/User";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { format } from "date-fns";

export default function SingleChat({
  message,
  currentUserId,
}: {
  message: Message;
  currentUserId: string | undefined;
}) {
  const sender: User = message.sender as User;
  console.log(message, currentUserId);
  return (
    <div
      className={`flex items-start mb-4 ${
        sender._id === currentUserId ? "justify-end" : ""
      }`}
    >
      {sender._id !== currentUserId && (
        <Avatar className="mr-2">
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.sender}`}
            alt={"message image"}
          />
          <AvatarFallback>{message.content[0]}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`rounded-lg p-3 max-w-[80%] ${
          sender._id === currentUserId ? "bg-blue-600" : "bg-gray-700"
        }`}
      >
        <p className="font-medium mb-1">
          {typeof message.sender == "string"
            ? message.sender
            : message.sender.firstName}
        </p>
        <p>{message.content}</p>
        {message.updatedAt && (
          <p className="text-xs text-gray-400 mt-1">
            {format(message.updatedAt, "PPpp")}
          </p>
        )}
      </div>
      {message.sender === currentUserId && (
        <Avatar className="ml-2">
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.sender}`}
            alt={message.sender}
          />
          <AvatarFallback>{message.content[0]}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
