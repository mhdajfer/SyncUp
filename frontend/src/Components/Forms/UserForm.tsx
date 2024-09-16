"use client";

import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/Components/ui/select";
import { toast } from "sonner";

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isBlocked?: boolean;
  age: number;
  phoneNumber: number;
  role?: string;
}

export default function UserForm() {
  const [formData, setFormData] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: 0,
    phoneNumber: 0,
    isBlocked: false,
    role: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log("Form submitted", formData);

    toast.success("User created successfully");
  };

  const onFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto py-8 text-sm bg-[#2C394B] text-white">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={onFormChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={onFormChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={onFormChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={onFormChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="Enter age"
                value={formData.age}
                onChange={onFormChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={onFormChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              name="role"
              value={formData.role}
              onValueChange={(value) => {
                setFormData((prevData) => ({ ...prevData, role: value }));
              }}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isBlocked">Is Blocked</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="isBlocked"
                name="isBlocked"
                type="checkbox"
                checked={formData.isBlocked}
                onChange={onFormChange}
              />
              <span>Yes</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Create User
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
