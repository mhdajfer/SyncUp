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
import { User } from "@/interfaces/User";
import { getProjectManagers } from "@/api/userService/user";
import { toast } from "sonner";

export interface CreateProjectResponse {
  success: boolean;
  project: Project;
  message: string;
}

export default function ProjectForm() {
  const [managerList, setManagerList] = useState<User[]>();
  const [formData, setFormData] = useState<Project>({
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
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log("Form submitted", formData);

    const response: CreateProjectResponse = await createProject(formData);

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }

    console.log(response);
  };

  // onFormChange function to update the form data
  const onFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        document: files[0],
      }));
    }
  };

  useEffect(() => {
    async function getData() {
      const data: User[] = await getProjectManagers();
      setManagerList(data);
    }
    getData();
  }, []);

  console.log(managerList);

  return (
    <Card className="w-full max-w-2xl mx-auto py-8 text-sm bg-[#2C394B] text-white">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                name="name"
                placeholder="Enter project name"
                value={formData.name}
                onChange={onFormChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager">Project Manager</Label>
              <Select
                name="managerId"
                value={formData.managerId}
                onValueChange={(value) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    managerId: value,
                  }));
                }}
              >
                <SelectTrigger id="managerId">
                  <SelectValue placeholder="Select project Manager" />
                </SelectTrigger>
                <SelectContent>
                  {managerList?.map((manager, i) => (
                    <SelectItem key={i} value={manager?._id}>
                      {manager?.firstName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your project"
              value={formData.description}
              onChange={onFormChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative">
                <Input
                  id="startDate"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={onFormChange}
                  required
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <div className="relative">
                <Input
                  id="dueDate"
                  name="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={onFormChange}
                  required
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                value={formData.status}
                onValueChange={(value) => {
                  setFormData((prevData) => ({ ...prevData, status: value }));
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                placeholder="Enter budget"
                value={formData.budget}
                onChange={onFormChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal">Project Goal</Label>
            <Textarea
              id="goal"
              name="goal"
              placeholder="Enter project goal"
              value={formData.goal}
              onChange={onFormChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="document">Upload Document</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="document"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("document")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> Select File
              </Button>
              <span className="text-sm text-gray-500">
                {formData.document
                  ? formData.document.name
                  : "No file selected"}
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
