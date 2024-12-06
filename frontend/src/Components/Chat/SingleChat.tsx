"use client";
import { Message } from "@/interfaces/Message";
import { User } from "@/interfaces/User";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { ImageModal } from "@/Components/ImageModal";

export default function SingleChat({
  message,
  currentUserId,
  isGroup,
}: {
  message: Message;
  currentUserId: string | undefined;
  isGroup: boolean;
}) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const sender: User = message.sender as User;
  const isCurrentUser = sender._id === currentUserId;

  const s3Url = process.env.NEXT_PUBLIC_S3_URL;

  if (!s3Url) console.log("s3 url not specified");

  const viewImage = () => {
    try {
      setIsImageModalOpen(true);
    } catch (error) {
      console.error("Error opening image:", error);
      toast.error("Failed to open image");
    }
  };

  return (
    <div
      className={`flex items-start mb-4 ${isCurrentUser ? "justify-end" : ""}`}
    >
      {!isCurrentUser && (
        <Avatar
          className="mr-2 w-10 border border-gray-500 flex justify-center items-center rounded-full 
        overflow-hidden "
        >
          <AvatarImage
            src={`${s3Url}/Image-${sender._id}.jpg`}
            alt={`Avatar of ${sender.firstName}`}
          />
          <AvatarFallback className="bg-orange-400 w-full flex justify-center items-center">
            {sender.firstName ? sender.firstName.slice(0, 2) : "?"}
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
        {message.file ? (
          <Image
            src={`${s3Url}/Message-${message._id}.jpg`}
            alt="Sent File"
            className="rounded-lg max-w-xs mt-2 cursor-pointer"
            width={100}
            height={100}
            onClick={viewImage}
          />
        ) : (
          <p>{message.content}</p>
        )}
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
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={`${s3Url}/Message-${message._id}.jpg`}
      />
    </div>
  );
}
