"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@/Components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { CalendarIcon, DollarSignIcon, UserIcon, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getOneProject } from "@/api/projectService/project";
import { Project } from "@/interfaces/Project";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { User } from "@/interfaces/User";
import { getProjectManagers } from "@/api/userService/user";
import { DatePickerDemo } from "../Date/DatePicker";

export default function NewSingleProject() {
  const router = useRouter();
  const { projectId }: { projectId: string } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  //   const [newComment, setNewComment] = useState("");
  const [managers, setManagers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState([
    { taskName: "", dueDate: "", assignee: "" },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Project>({
    name: "",
    description: "",
    managerId: "",
    start_date: "",
    due_date: "",
    status: "",
    task_ids: [],
    budget: 0,
    goal: "",
    document: null,
    comments: [],
    created_by: "",
  });

  useEffect(() => {
    setIsOpen(true);
    async function getProject() {
      const project = await getOneProject(projectId);

      if (!project.success || !project.data) {
        return toast.error("Project not found");
      }
      setProject(project.data);
      setEditedProject(project.data);
    }

    getProject();
  }, [projectId]);

  const parseDateString = (dateString: string) => {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const fetchManagers = async () => {
    const response = await getProjectManagers();
    if (!response.success || !response.data) {
      return toast.error("Failed to fetch managers");
    }
    setManagers(response.data);
    console.log(response.data);
  };

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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    fetchManagers();
  };

  const handleAddTask = () => {
    setTasks([...tasks, { taskName: "", dueDate: "", assignee: "" }]);
  };

  const handleTaskChange = (index: number, field: string, value: string) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTasks(updatedTasks);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedProject({
      ...editedProject!,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveChanges = () => {
    // Save changes logic goes here
    toast.success("Project details updated!");
    console.log(editedProject);

    setIsEditing(false); // Exit edit mode after saving
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
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className=" bg-gray-800 text-gray-100 shadow-xl overflow-hidden border-gray-600 w-auto">
                  <X
                    className="h-4 w-4 absolute top-1 right-1 text-gray-200 hover:text-white cursor-pointer hover:font-xl"
                    onClick={handleClose}
                  />
                  <CardHeader className="border-b border-gray-700">
                    <CardTitle className="flex items-center justify-between">
                      {isEditing ? (
                        <Input
                          name="name"
                          value={editedProject?.name || ""}
                          onChange={handleInputChange}
                          className="text-2xl font-bold text-gray-100"
                        />
                      ) : (
                        <span className="text-2xl font-bold">
                          {project?.name}
                        </span>
                      )}
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
                    {isEditing ? (
                      <Textarea
                        name="description"
                        value={editedProject?.description || ""}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-300">{project?.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
                        <span>
                          Start:{" "}
                          {isEditing ? (
                            <Input
                              type="date"
                              name="start_date"
                              value={editedProject?.start_date || ""}
                              onChange={handleInputChange}
                              className="bg-gray-700 text-gray-100"
                            />
                          ) : project ? (
                            formatDate(project?.start_date)
                          ) : (
                            ""
                          )}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
                        <span>
                          Due:{" "}
                          {isEditing ? (
                            <Input
                              type="date"
                              name="due_date"
                              value={editedProject?.due_date || ""}
                              onChange={handleInputChange}
                              className="bg-gray-700 text-gray-100"
                            />
                          ) : project ? (
                            formatDate(project?.due_date)
                          ) : (
                            ""
                          )}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <DollarSignIcon className="w-5 h-5 mr-2 text-gray-400" />
                        <span>
                          Budget:{" "}
                          {isEditing ? (
                            <Input
                              type="number"
                              name="budget"
                              value={editedProject?.budget || ""}
                              onChange={handleInputChange}
                              className="bg-gray-700 text-gray-100"
                            />
                          ) : (
                            `$${project?.budget.toLocaleString()}`
                          )}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <UserIcon className="w-5 h-5 mr-2 text-gray-400" />
                        {!isEditing ? (
                          <span>Manager: {project?.managerId}</span>
                        ) : (
                          <Select
                            onValueChange={(value) =>
                              setEditedProject({
                                ...editedProject,
                                managerId: value,
                              })
                            }
                            value={editedProject.managerId}
                          >
                            <SelectTrigger className="w-full bg-gray-700 text-white">
                              <SelectValue placeholder="Select a manager" />
                            </SelectTrigger>
                            <SelectContent>
                              {managers.map((manager) => (
                                <SelectItem
                                  key={manager?._id}
                                  value={manager?._id || ""}
                                >
                                  {manager.firstName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Goal</h3>
                      {isEditing ? (
                        <Textarea
                          name="goal"
                          value={editedProject?.goal || ""}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-300">{project?.goal}</p>
                      )}
                    </div>

                    <Button
                      onClick={isEditing ? handleSaveChanges : handleEditToggle}
                      className={`${
                        isEditing
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white`}
                    >
                      {isEditing ? "Save Changes" : "Edit Project"}
                    </Button>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Tasks</h3>
                      {tasks.map((task, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-3 gap-4 mb-4"
                        >
                          <input
                            type="text"
                            placeholder="Task Name"
                            className="bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500"
                            value={task.taskName}
                            onChange={(e) =>
                              handleTaskChange(
                                index,
                                "taskName",
                                e.target.value
                              )
                            }
                          />

                          {/* <DatePickerDemo
                            date={parseDateString(task.dueDate) || Date}
                          /> */}
                          <input
                            type="date"
                            className="bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500"
                            value={task.dueDate}
                            onChange={(e) =>
                              handleTaskChange(index, "dueDate", e.target.value)
                            }
                          />
                          <input
                            type="text"
                            placeholder="Assignee"
                            className="bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500"
                            value={task.assignee}
                            onChange={(e) =>
                              handleTaskChange(
                                index,
                                "assignee",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                      <Button
                        onClick={handleAddTask}
                        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Add Task
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Dialog>
    </>
  );
}
