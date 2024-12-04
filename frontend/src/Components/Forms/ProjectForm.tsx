"use client";

import { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/Components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Project } from "@/interfaces/Project";
import { createProject } from "@/api/projectService/project";
import { getProjectManagers } from "@/api/userService/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { FileUpload } from "../FileUpload";
import { fileTypeExtensionMap } from "@/Consts";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getUploadUrl, uploadFileToS3 } from "@/lib/S3";

export interface UserDetails {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isBlocked?: boolean;
  age: number;
  phoneNumber: number;
  role?: string;
}

export interface CreateProjectResponse {
  success: boolean;
  project: Project;
  message: string;
}

const projectSchema = z
  .object({
    name: z.string().trim().min(5, "Name must be at least 5 characters"),
    description: z
      .string()
      .trim()
      .min(5, "Description must be at least 5 characters")
      .max(100, "Project name should not exceed 100 characters"),
    managerId: z.string(),
    start_date: z.coerce.date(),
    due_date: z.coerce.date(),
    status: z.enum(["pending", "in progress", "completed"]),
    budget: z.coerce.number().positive("Budget must be a positive number"),
    goal: z.string().trim().min(5, "Description must be at least 5 characters"),
    document: z.any(),
  })
  .refine((data) => data.due_date >= data.start_date, {
    message: "Due date cannot be earlier than start date",
    path: ["due_date"],
  });

export default function ProjectForm() {
  const router = useRouter();
  const [managerList, setManagerList] = useState<UserDetails[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<Project>({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
  });

  const startDate = watch("start_date");
  const endDate = watch("due_date");

  useEffect(() => {
    async function getData() {
      const response = await getProjectManagers();
      setManagerList(response.data as UserDetails[]);
      console.log("pmanagers", response.data);
    }
    getData();
  }, []);

  const onSubmit = async () => {
    try {
      const data = getValues();

      if (file) {
        const fileExtension = fileTypeExtensionMap[file.type];

        const fileName = "Doc-" + currentUserId + fileExtension;

        const response = await getUploadUrl(fileName, file.type);

        if (response.success) {
          const { uploadUrl } = response;

          if (!uploadUrl)
            return toast.error("didn't get url for the image upload");

          await uploadFileToS3(uploadUrl, file);
        }
      }

      const response: CreateProjectResponse = await createProject({
        ...data,
      });

      if (response.success) {
        toast.success(response.message);
        router.push("/employee/manager/dashboard/projects");
      } else {
        toast.error(response.message);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message);
      } else toast.error("An error occurred");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <Card className="w-full max-w-2xl mx-auto py-8 text-sm bg-gray-900 text-white border border-slate-700">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="Enter project name"
                  className="border border-slate-800"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md w-full">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="manager">Project Manager</Label>
                <Select
                  onValueChange={(value) => {
                    setValue("managerId", value);
                    trigger("managerId");
                  }}
                >
                  <SelectTrigger id="managerId">
                    <SelectValue placeholder="Select project Manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {managerList.map((manager) => (
                      <SelectItem key={manager._id} value={manager._id}>
                        {manager.firstName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.managerId && (
                  <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md w-full">
                    {errors.managerId.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                className="border border-slate-800"
                id="description"
                placeholder="Describe your project"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md w-full">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative ">
                  <Input
                    id="startDate"
                    className="border border-slate-800"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    max={endDate}
                    {...register("start_date")}
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {errors.start_date && (
                  <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md w-full">
                    {errors.start_date.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <div className="relative ">
                  <Input
                    id="dueDate"
                    className="border border-slate-800"
                    type="date"
                    min={startDate || new Date().toISOString().split("T")[0]}
                    {...register("due_date")}
                  />

                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2  text-gray-400" />
                </div>
                {errors.due_date && (
                  <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md w-full">
                    {errors.due_date.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => {
                    setValue("status", value);
                    trigger("status");
                  }}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Planning</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md w-full">
                    {errors.status.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  className="border border-slate-800"
                  type="number"
                  placeholder="Enter budget"
                  {...register("budget")}
                />
                {errors.budget && (
                  <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md w-full">
                    {errors.budget.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Project Goal</Label>
              <Textarea
                className="border border-slate-800"
                id="goal"
                placeholder="Enter project goal"
                {...register("goal")}
              />
              {errors.goal && (
                <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md w-full">
                  {errors.goal.message}
                </p>
              )}
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="document">Upload Document</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="document"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("document")?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" /> Select File
                </Button>
                <span className="text-sm text-gray-500">
                  {errors.document && (
                    <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md w-full">
                      {errors.document.message}
                    </p>
                  )}
                </span>
              </div>
            </div> */}
            <FileUpload
              onFileChange={(newFile: File | null) => {
                setFile(newFile);
                setError(null);
              }}
              accept=".pdf,.doc,.docx"
              maxSize={5000000}
              error={error}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-violet-950 hover:bg-violet-900"
            >
              Create Project
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
