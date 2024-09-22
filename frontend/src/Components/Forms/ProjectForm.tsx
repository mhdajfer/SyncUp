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
import { CalendarIcon, Upload } from "lucide-react";
import { Project } from "@/interfaces/Project";
import { createProject } from "@/api/projectService/project";
import { getProjectManagers } from "@/api/userService/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
      .min(5, "Description must be at least 5 characters"),
    managerId: z.string(),
    start_date: z.coerce.date(),
    due_date: z.coerce.date(),
    status: z.enum(["pending", "in progress", "completed"]),
    budget: z.coerce.number().positive("Budget must be a positive number"),
    goal: z.string().trim(),
    document: z.any(),
  })
  .refine((data) => data.due_date >= data.start_date, {
    message: "Due date cannot be earlier than start date",
    path: ["due_date"],
  });

export default function ProjectForm() {
  const router = useRouter();
  const [managerList, setManagerList] = useState<UserDetails[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<Project>({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
  });

  // Fetch project managers on component mount
  useEffect(() => {
    async function getData() {
      const response = await getProjectManagers();
      setManagerList(response.data);
    }
    getData();
  }, []);

  // Handle form submission
  const onSubmit = async () => {
    try {
      const data = getValues();

      const response: CreateProjectResponse = await createProject({
        ...data,
      });

      if (response.success) {
        toast.success(response.message);
        router.push("/employee/manager/dashboard/projects");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An error occurred");
      console.log(`Error: ${error}`);
    }
  };

  // Handle file input
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("document", file); // Set file in form state
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto py-8 text-sm bg-[#2C394B] text-white">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="Enter project name"
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
                <Input id="startDate" type="date" {...register("start_date")} />
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
                <Input id="dueDate" type="date" {...register("due_date")} />

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
                  setValue("status", value); // Manually set value when user selects an option
                  trigger("status"); // Trigger validation for this field
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
          <div className="space-y-2">
            <Label htmlFor="document">Upload Document</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="document"
                type="file"
                className="hidden"
                onChange={handleFileChange} // Handle file manually
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("document")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> Select File
              </Button>
              <span className="text-sm text-gray-500">
                {/* Display file name */}
                {errors.document && (
                  <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md w-full">
                    {errors.document.message}
                  </p>
                )}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Create Project
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
