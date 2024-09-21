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

// Define Zod schema for validation
const projectSchema = z.object({
  name: z.string().trim().min(5, "Name must be at least 5 characters"),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters"),
  managerId: z.string().optional(),
  start_date: z.coerce.date(),
  due_date: z.coerce.date(),
  status: z.enum(["pending", "in progress", "completed"]),
  budget: z.coerce.number().positive("Budget must be a positive number"),
  goal: z.string().trim(),
  document: z.any(),
});

export default function ProjectForm() {
  const router = useRouter();
  const [managerList, setManagerList] = useState<UserDetails[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Project>({
    resolver: zodResolver(projectSchema),
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
      console.log(data);

      // const response: CreateProjectResponse = await createProject({
      //   ...data,
      // });

      //   if (response.success) {
      //     toast.success(response.message);
      //     router.push("/employee/manager/dashboard/projects");
      //   } else {
      //     toast.error(response.message);
      //   }
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
              {errors.name && <span>{errors.name.message}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager">Project Manager</Label>
              <Select {...register("managerId")}>
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
              {errors.managerId && <span>{errors.managerId.message}</span>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project"
              {...register("description")}
            />
            {errors.description && <span>{errors.description.message}</span>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative ">
                <Input id="startDate" type="date" {...register("start_date")} />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.start_date && <span>{errors.start_date.message}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <div className="relative ">
                <Input id="dueDate" type="date" {...register("due_date")} />

                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2  text-gray-400" />
              </div>
              {errors.due_date && <span>{errors.due_date.message}</span>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select {...register("status")}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Planning</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <span>{errors.status.message}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                placeholder="Enter budget"
                {...register("budget")}
              />
              {errors.budget && <span>{errors.budget.message}</span>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal">Project Goal</Label>
            <Textarea
              id="goal"
              placeholder="Enter project goal"
              {...register("goal")}
            />
            {errors.goal && <span>{errors.goal.message}</span>}
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
                {errors.document && <span>{errors.document.message}</span>}
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
