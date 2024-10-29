"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { X, Users, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Project } from "@/interfaces/Project";
import { User } from "@/interfaces/User";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { toast } from "sonner";
import { addTeamMember, removeTeamMember } from "@/api/projectService/project";
import { AxiosError } from "axios";

export default function ProjectTeam({
  project,
  developers,
  setProject,
}: {
  project: Project;
  developers: User[];
  setProject: (project: Project) => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDev, setNewDev] = useState<User | null>(null);

  const handleRemoveDeveloper = async (developerId: string) => {
    try {
      if (!developerId) return toast.error("developer not selected");
      if (!project._id) return toast.error("Project not found");
      const response = await removeTeamMember(developerId, project._id);

      if (response.success) {
        setIsDialogOpen(false);
        setProject(response.data);
        toast.success(response.message);
      } else {
        toast.error(" member not removed");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error);
      }
      console.log(error);
    }
  };

  const handleSetMember = (value: string) => {
    const user = developers.find((dev) => dev._id === value);
    if (!user) return toast.error("select user not added");

    setNewDev(user);
  };

  const handleAddMember = async () => {
    try {
      if (!newDev?._id) return toast.error("developer not selected");
      if (!project._id) return toast.error("Project not found");
      const response = await addTeamMember(newDev?._id, project._id);

      if (response.success) {
        setIsDialogOpen(false);
        setProject(response.data);
        toast.success(response.message);
      } else {
        toast.error("new member not added");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error);
      }
      console.log(error);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 pt-10 relative">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="  absolute right-6 bg-blue-700 border-0 text-white hover:bg-blue-800 hover:text-white"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Member
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-900 p-4 rounded-md left-[50%] text-gray-100 absolute">
          <DialogHeader>
            <DialogTitle>Add New Team Member</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the details of the new team member below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="name" className="text-right">
              Developer
            </Label>
            <div className="flex items-center my-2">
              <Select onValueChange={handleSetMember}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Add a Member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Developers</SelectLabel>
                    {developers.map((dev) => (
                      <SelectItem key={dev._id} value={dev._id || ""}>
                        {dev.firstName}
                        {dev.lastName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddMember}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-200 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Project Team
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {project.developers &&
              project.developers.length > 0 &&
              project.developers.map((dev) => (
                <Card key={dev._id} className="bg-gray-700 border-gray-600">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <Avatar className=" cursor-pointer  ">
                        <AvatarImage
                          src={dev.avatar}
                          alt="Profile picture"
                          className="w-12 h-12 bg-cover  rounded-full"
                        />
                        <AvatarFallback className=" bg-green-400 rounded-full p-2">
                          {dev.firstName[0].toUpperCase()}
                          {dev.lastName[1].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-gray-100">
                          {dev.firstName}
                        </h4>
                        <p className="text-sm text-gray-400">{dev.role}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-gray-100 hover:bg-gray-600"
                      onClick={() => handleRemoveDeveloper(dev._id || "")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
