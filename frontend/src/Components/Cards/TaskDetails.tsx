"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarDays, Edit, Flag, Save, User, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { editTask, getTask } from "@/api/projectService/project";
import { Task } from "@/interfaces/Project";

export default function TaskDetails() {
  const { taskId }: { taskId: string } = useParams();
  const [task, setTask] = useState<Task>({
    _id: "",
    title: "",
    projectId: "",
    status: "",
    desc: "",
    assignee: "",
    priority: "",
    due_date: "",
    remarks: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTask(task);
  };

  const handleSave = async () => {
    try {
      const response = await editTask(editedTask);

      if (response.success) {
        setTask(editedTask);
        toast.success(response.message);
      } else toast.error(response.message);
      setIsEditing(false);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else toast.error("task not updated");
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask(task);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    async function getTaskDetails() {
      try {
        const response = await getTask(taskId);

        if (response.success) {
          setTask(response.data);
          console.log(response.data);
        } else toast.error(response.message);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);
          console.log(error);
        } else {
          toast.error("error while fetching task details");
          console.log(error);
        }
      }
    }

    getTaskDetails();
  }, [taskId]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900 p-6 rounded-lg shadow-lg text-gray-100 w-full min-h-96"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{task.title}</h1>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-400"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={editedTask.title}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-400"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={editedTask.status}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="desc"
                className="block text-sm font-medium text-gray-400"
              >
                Description
              </label>
              <textarea
                id="desc"
                name="desc"
                value={editedTask.desc}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="assignee"
                className="block text-sm font-medium text-gray-400"
              >
                Assignee
              </label>
              <input
                type="text"
                id="assignee"
                name="assignee"
                value={
                  typeof editedTask.assignee == "string"
                    ? editedTask.assignee
                    : editedTask.assignee.firstName
                }
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-400"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={editedTask.priority}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="due_date"
                className="block text-sm font-medium text-gray-400"
              >
                Due Date
              </label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={editedTask.due_date}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="remarks"
                className="block text-sm font-medium text-gray-400"
              >
                Remarks
              </label>
              <textarea
                id="remarks"
                name="remarks"
                value={editedTask.remarks}
                onChange={handleChange}
                rows={2}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-400" />
                <div>
                  <p className="text-gray-400">Assignee</p>
                  <p>
                    {typeof task.assignee === "string" ? (
                      <span>{task.assignee}</span>
                    ) : (
                      <span>
                        {task.assignee.firstName} {task.assignee.lastName}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <CalendarDays className="w-5 h-5 mr-2 text-red-400" />
                <div>
                  <p className="text-gray-400">Due Date</p>

                  {task.due_date ? (
                    <p>{format(new Date(task.due_date), "MMMM dd, yyyy")}</p>
                  ) : (
                    <p>No due date available</p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <Flag className="w-5 h-5 mr-2 text-green-400" />
                <div>
                  <p className="text-gray-400">Status</p>
                  <p>{task.status}</p>
                </div>
              </div>
              {task.priority && (
                <div className="flex items-center">
                  <Flag className="w-5 h-5 mr-2 text-yellow-400" />
                  <div>
                    <p className="text-gray-400">Priority</p>
                    <p>{task.priority}</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <p className="text-gray-400 mb-2">Description</p>
              <p>{task.desc}</p>
            </div>

            <div>
              <p className="text-gray-400 mb-2">Remarks</p>
              <p className="italic">{task.remarks}</p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
