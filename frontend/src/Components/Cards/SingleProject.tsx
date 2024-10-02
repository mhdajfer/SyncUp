"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/Components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import {
  CalendarIcon,
  DollarSignIcon,
  UserIcon,
  // FileTextIcon,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getOneProject } from "@/api/projectService/project";
import { Project } from "@/interfaces/Project";

export default function ProjectDetailsModal() {
  const router = useRouter();
  const { projectId }: { projectId: string } = useParams();
  toast.success(projectId);
  const [project, setProject] = useState<Project | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
    async function getProject() {
      console.log(projectId);
      const project = await getOneProject(projectId);

      if (!project.success || !project.data) {
        return toast.error("project not found");
      }
      setProject(project.data);
    }

    getProject();
  }, [projectId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in progress":
        return "bg-blue-600";
      case "completed":
        return "bg-green-600";
      case "on hold":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2d3748;
          border-radius: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a5568;
          border-radius: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #718096;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4a5568 #2d3748;
        }
      `}</style>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <AnimatePresence>
          {isOpen && (
            <DialogContent className="sm:max-w-[800px] border-none shadow-none p-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="w-full bg-gray-800 text-gray-100 shadow-xl overflow-hidden">
                  <Button
                    onClick={handleClose}
                    className="absolute top-0 right-0 bg-gray-700 hover:bg-gray-600 text-gray-100"
                    size="icon"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only ">Close</span>
                  </Button>
                  <CardHeader className="border-b border-gray-700">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {project?.name}
                      </span>
                      <Badge
                        className={`${getStatusColor(
                          project?.status || "pending"
                        )} text-white`}
                      >
                        {project?.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 mt-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <p className="text-gray-300">{project?.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
                        <span>
                          Start:{" "}
                          {project ? formatDate(project?.start_date) : ""}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
                        <span>
                          Due: {project ? formatDate(project?.due_date) : ""}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <DollarSignIcon className="w-5 h-5 mr-2 text-gray-400" />
                        <span>Budget: ${project?.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <UserIcon className="w-5 h-5 mr-2 text-gray-400" />
                        <span>Manager: {project?.managerId}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Goal</h3>
                      <p className="text-gray-300">{project?.goal}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Project Document
                      </h3>
                      {/* <Link href={project?.document || ""}>
                        {" "}
                        <a className="text-blue-400 hover:underline flex items-center">
                          <FileTextIcon className="w-5 h-5 mr-2" />
                          View Document
                        </a>
                      </Link> */}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Comments</h3>
                      <div className="space-y-4">
                        {project?.comments ? (
                          project?.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="bg-gray-700 p-4 rounded-lg"
                            >
                              <div className="flex items-center mb-2">
                                <Avatar className="w-8 h-8 mr-2">
                                  <AvatarFallback>
                                    {comment.author[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-semibold">
                                  {comment.author}
                                </span>
                                <span className="text-gray-400 text-sm ml-auto">
                                  {new Date(comment.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-gray-300">{comment.content}</p>
                            </div>
                          ))
                        ) : (
                          <h1>Hi</h1>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Add a Comment
                      </h3>
                      <Textarea
                        placeholder="Type your comment here."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500"
                      />
                      <Button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">
                        Submit Comment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>
    </>
  );
}
