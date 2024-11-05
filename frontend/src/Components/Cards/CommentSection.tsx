"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Separator } from "@/Components/ui/separator";
import { Send } from "lucide-react";
import { Comment } from "@/interfaces/Project";
import { toast } from "sonner";
import { submitComment } from "@/api/Communication/comments";
import { AxiosError } from "axios";
import { User } from "@/interfaces/User";
import { format } from "date-fns";

export default function CommentSection({
  initialComments = [],
  taskId,
  author,
}: {
  initialComments: Comment[];
  taskId: string;
  author: User;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!newComment.trim()) return toast.warning("No comment found");

      const latestComment = {
        author: author,
        content: newComment.trim(),
        timeStamp: new Date().toISOString(),
      };

      const response = await submitComment(newComment, taskId);

      if (response.success) {
        toast.success(response.message);
        setComments((prevComments) => [...prevComments, latestComment]);
        setNewComment("");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error);
      } else toast.error("error while adding comment");
    }
  };
  console.log("comments", comments);
  return (
    <Card className="w-full bg-gray-900 text-gray-100 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Task Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {comments.map((comment, index) => (
            <div key={comment._id} className="mb-4">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage
                    src={
                      typeof comment.author == "string"
                        ? comment.author
                        : comment.author.avatar
                    }
                    alt={
                      typeof comment.author == "string"
                        ? comment.author
                        : comment.author.firstName
                    }
                  />
                  <AvatarFallback>
                    <div className="bg-green-500 w-full h-full flex items-center justify-center">
                      {typeof comment.author == "string"
                        ? comment.author
                        : comment.author.firstName[0]}
                    </div>
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">
                      {typeof comment.author == "string"
                        ? comment.author
                        : comment.author.firstName}
                      {typeof comment.author == "string"
                        ? comment.author
                        : comment.author.role === "pManager" && (
                            <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                              PM
                            </span>
                          )}
                    </h4>
                    <span className="text-xs text-gray-400">
                      {format(new Date(comment.timeStamp), "PPpp")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-300">
                    {comment.content}
                  </p>
                </div>
              </div>
              {index < comments.length - 1 && (
                <Separator className="my-4 bg-gray-700" />
              )}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmitComment} className="flex w-full space-x-2">
          <Input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 bg-gray-800 text-gray-100 border-gray-700 focus:ring-blue-500 focus:border-blue-500"
          />
          <Button type="submit" size="icon" variant="secondary">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send comment</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
