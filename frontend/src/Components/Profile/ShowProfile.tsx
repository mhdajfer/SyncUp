"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { User } from "@/interfaces/User";

export default function ShowProfile({ initialUser }: { initialUser: User }) {
  const [user, setUser] = useState<User>(initialUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: name === "age" ? parseInt(value, 10) : value,
    }));
  };

  const handleUpdate = () => {
    console.log("Updated user details:", user);
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prevUser) => ({
          ...prevUser,
          profilePicture: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full px-16 bg-gray-900 text-white border border-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">
          User Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="flex justify-center">
          <Avatar
            className="w-24 h-24 cursor-pointer"
            onClick={handleProfilePictureClick}
          >
            <AvatarImage src={"asdfasfasfdasf"} alt="Profile picture" />
            <AvatarFallback>
              {user.firstName[0]}
              {user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            aria-label="Change profile picture"
          />
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={user.firstName}
              onChange={handleInputChange}
              className=" border border-gray-800 text-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={user.lastName}
              onChange={handleInputChange}
              className=" border border-gray-800 text-gray-400"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            type="number"
            value={user.age}
            onChange={handleInputChange}
            className=" border border-gray-800 text-gray-400"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleInputChange}
            className=" border border-gray-800 text-gray-400"
          />
        </div>
        <div>
          <Label htmlFor="tenant_id">Tenant ID</Label>
          <Input
            id="tenant_id"
            name="tenant_id"
            value={user.tenant_id}
            onChange={handleInputChange}
            className=" border border-gray-800 text-gray-400"
          />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={user.phoneNumber}
            onChange={handleInputChange}
            className=" border border-gray-800 text-gray-400"
          />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            name="role"
            value={user.role}
            onChange={handleInputChange}
            className=" border border-gray-800 text-gray-400"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpdate}
          className="w-full bg-violet-950 hover:bg-violet-900"
        >
          Update Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
