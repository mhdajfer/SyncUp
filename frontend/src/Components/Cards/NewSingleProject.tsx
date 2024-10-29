"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@/Components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
  CalendarDays,
  CalendarIcon,
  DollarSignIcon,
  User,
  UserIcon,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  addTasks,
  editProject,
  getOneProject,
  getProjectTasks,
} from "@/api/projectService/project";
import { Project, Task } from "@/interfaces/Project";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getDevelopers, getProjectManagers } from "@/api/userService/user";

import { AxiosError } from "axios";
import { User as IUser } from "@/interfaces/User";
import { format } from "date-fns";
import Tiptap from "../RichText/TipTap";
import ProjectTeam from "./ProjectTeam";

interface newTask {
  title: string;
  status: string;
  projectId: string;
  due_date: string;
  assignee: string;
  priority: string;
  remarks: string;
  desc: string;
  start_date: string;
}

export default function NewSingleProject() {
  const router = useRouter();
  const { projectId }: { projectId: string } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  //   const [newComment, setNewComment] = useState("");
  const [managers, setManagers] = useState<IUser[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newTasks, setNewTasks] = useState<newTask[]>([]);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Project>({
    name: "",
    description: "",
    managerId: "",
    start_date: "",
    due_date: "",
    status: "",
    budget: 0,
    goal: "",
    document: null,
    comments: [],
    created_by: "",
  });

  const [developers, setDevelopers] = useState<IUser[]>([]);

  useEffect(() => {
    setIsOpen(true);
    async function getProjectandDeveloper() {
      const project = await getOneProject(projectId);

      const response = await getDevelopers();

      if (response.success) {
        setDevelopers(response.data);
      } else toast.error(response.message);

      if (!project.success || !project.data) {
        return toast.error("Project not found");
      }
      console.log(project.data);

      setProject(project.data);
      setEditedProject(project.data);
    }

    async function getTasks() {
      try {
        const response = await getProjectTasks(projectId);

        if (response.success) {
          setTasks(response.data);
        } else {
          toast.error("failed to get tasks");
        }
      } catch (error) {
        toast.error("tasks not found ");
        console.log(error);
      }
    }
    getProjectandDeveloper();
    getTasks();
  }, [projectId]);

  const fetchManagers = async () => {
    const response = await getProjectManagers();
    if (!response.success || !response.data) {
      return toast.error("Failed to fetch managers");
    }
    setManagers(response.data);
    console.log(response.data);
  };

  const validateTasks = (tasks: Task[]) => {
    return tasks.every((task) => {
      return (
        task.title.trim() !== "" &&
        task.desc &&
        task.desc.trim() !== "" &&
        task.assignee !== "" &&
        task.due_date.trim() !== ""
      );
    });
  };

  const handleCreateTasks = async () => {
    try {
      console.log(newTasks);

      if (newTasks.length == 0) return toast.warning("new tasks not found");

      if (!validateTasks(newTasks) || !project?._id)
        return toast.error("Invalid details provided");

      const response = await addTasks(newTasks, project._id);

      if (response.success) {
        toast.success(response.message);
        setIsEditing(false);

        setTasks((prevTasks) => [...prevTasks, ...newTasks]);
        setTimeout(() => setNewTasks([]), 1000);
      } else {
        toast.error(response.message);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
        console.log(error);
      } else {
        toast.error("Tasks not added");
        console.log(error);
      }
    }
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

  const handleCancelTask = (index: number) => {
    console.log(index);

    const updatedTasks = newTasks.filter((_, taskIndex) => taskIndex !== index);

    setNewTasks(updatedTasks);
  };

  const handleClose = () => {
    router.back();
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    fetchManagers();
  };

  const handleAddTask = () => {
    setNewTasks([
      ...newTasks,
      {
        title: "",
        status: "",
        projectId: "",
        due_date: "",
        assignee: "",
        priority: "",
        remarks: "",
        desc: "",
        start_date: "",
      },
    ]);
  };

  const handleTaskChange = (index: number, field: string, value: string) => {
    const updatedTasks = [...newTasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setNewTasks(updatedTasks);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedProject({
      ...editedProject!,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await editProject(editedProject);

      if (response.success) {
        toast.success(response.message);
        setProject(response.data);
        console.log(editedProject);
      } else toast.error(response.message);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
        console.log("something went wrong", error);
      } else toast.error("project not updated");
      console.log(error);
    }

    setIsEditing(false);
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
            <div className="md:min-w-[1000px]">
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
                          <span>
                            Manager:{" "}
                            {typeof project?.managerId === "string" ? (
                              <span>{project.managerId}</span>
                            ) : (
                              <span>
                                {project?.managerId.firstName}{" "}
                                {project?.managerId.lastName}
                              </span>
                            )}
                          </span>
                        ) : (
                          <Select
                            onValueChange={(value) =>
                              setEditedProject({
                                ...editedProject,
                                managerId: value,
                              })
                            }
                            value={
                              typeof editedProject?.managerId === "string"
                                ? editedProject.managerId
                                : editedProject.managerId._id
                            }
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

                    {project && (
                      <ProjectTeam
                        developers={developers}
                        project={project}
                        setProject={setProject}
                      />
                    )}

                    {tasks.length > 0 ? (
                      <div className=" ">
                        <h2 className="text-md font-bold text-gray-100 mb-6">
                          Task List
                        </h2>
                        <div className=" grid grid-cols-2 gap-5">
                          {tasks?.map((task, index) => (
                            <div
                              key={index}
                              className="bg-gray-900 p-4 rounded-md shadow w-full h-full"
                            >
                              <h3
                                className="text-lg font-semibold text-gray-100 mb-2 hover:underline cursor-pointer hover:text-gray-200"
                                onClick={() =>
                                  router.push(`${projectId}/${task._id}`)
                                }
                              >
                                {task.title}
                              </h3>
                              <div className="flex flex-wrap gap-4">
                                <div className="flex items-center text-gray-300">
                                  <CalendarDays className="w-4 h-4 mr-2" />
                                  <span>
                                    {format(
                                      new Date(task.due_date),
                                      "MMMM dd, yyyy"
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center text-gray-300">
                                  <User className="w-4 h-4 mr-2" />
                                  {typeof task.assignee === "string" ? (
                                    <span>{task.assignee}</span>
                                  ) : (
                                    <span>
                                      {task.assignee.firstName}{" "}
                                      {task.assignee.lastName}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <h2>No tasks were created for this project...</h2>
                    )}

                    <div className="">
                      <h3 className="text-lg font-semibold mb-2">Tasks</h3>

                      {newTasks.map((task, index) => (
                        <div
                          key={index}
                          className="border border-gray-700 p-6 rounded-xl bg-gray-800 mb-6 shadow-md relative pe-24 transition-all hover:shadow-lg"
                        >
                          <input
                            type="text"
                            placeholder="Task Name"
                            className="w-full bg-gray-700 text-gray-100 border border-gray-600 
                 focus:ring-2 focus:ring-blue-500 focus:outline-none 
                 p-3 mb-4 rounded-lg placeholder-gray-400 transition-colors"
                            value={task.title}
                            onChange={(e) =>
                              handleTaskChange(index, "title", e.target.value)
                            }
                          />

                          <div className="mb-4">
                            <Tiptap
                              content={task.desc}
                              setContent={(content) =>
                                handleTaskChange(index, "desc", content)
                              }
                            />
                          </div>

                          <div>
                            <label
                              className={` text-gray-400 text-sm 
                    transition-all duration-200 
                    `}
                            >
                              Start Date
                            </label>
                            <input
                              type="date"
                              placeholder="Start Date"
                              className="w-full bg-gray-700 text-gray-100 border border-gray-600 
                 focus:ring-2 focus:ring-blue-500 focus:outline-none 
                 p-3 mb-4 rounded-lg transition-colors"
                              value={task.start_date}
                              min={new Date().toISOString().split("T")[0]}
                              max={task.due_date || ""}
                              onChange={(e) =>
                                handleTaskChange(
                                  index,
                                  "start_date",
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          <div className=" mb-6">
                            <label
                              className={` text-gray-400 text-sm 
                    transition-all duration-200 
                    `}
                            >
                              Due Date
                            </label>
                            <input
                              type="date"
                              className="w-full bg-gray-700 text-gray-100 border border-gray-600 
                   focus:ring-2 focus:ring-blue-500 focus:outline-none 
                   p-3 rounded-lg transition-colors"
                              value={task.due_date}
                              min={task.start_date || ""}
                              onChange={(e) =>
                                handleTaskChange(
                                  index,
                                  "due_date",
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          <div>
                            <label
                              className={` text-gray-400 text-sm 
                    transition-all duration-200 
                   `}
                            >
                              Assignee
                            </label>
                            <Select
                              onValueChange={(value) =>
                                handleTaskChange(index, "assignee", value)
                              }
                            >
                              <SelectTrigger
                                className="w-full bg-gray-700 text-white p-3 rounded-lg 
                              border border-gray-600 mb-4 transition-colors 
                              hover:border-blue-500"
                              >
                                <SelectValue placeholder="Select a Developer" />
                              </SelectTrigger>

                              <SelectContent>
                                {project?.developers &&
                                  project?.developers.map((developer) => (
                                    <SelectItem
                                      key={developer?._id}
                                      value={developer?._id || ""}
                                    >
                                      {developer.firstName}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <X
                            className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer 
                 absolute right-6 top-[50%] transform -translate-y-1/2 
                 transition-colors"
                            onClick={() => handleCancelTask(index)}
                          />
                        </div>
                      ))}

                      <div className="flex space-x-5">
                        <Button
                          onClick={handleAddTask}
                          className="mt-2 bg-blue-800 hover:bg-blue-700 text-white"
                        >
                          Add Task
                        </Button>
                        <Button
                          onClick={handleCreateTasks}
                          className="mt-2 bg-violet-900 hover:bg-violet-700 text-white"
                        >
                          Create Tasks
                        </Button>
                      </div>
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
