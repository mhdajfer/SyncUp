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
import { getUploadUrl, uploadFileToS3 } from "@/lib/S3";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { User } from "@/interfaces/User";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { editProfile } from "@/api/userService/user";

export default function ShowProfile({ initialUser }: { initialUser: User }) {
  const [user, setUser] = useState<User>(initialUser);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUploaded, setImageUploaded] = useState<File | null>(null);

  const s3Url = process.env.NEXT_PUBLIC_S3_URL;

  if (!s3Url) toast.info("s3 url not specified");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: name === "age" ? parseInt(value, 10) : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await editProfile(user);

      if (response.success) {
        toast.success("profile updated.");
        setUser(user);
      } else toast.error(response.message);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "something went wrong");
      } else console.log(error);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveImage = async () => {
    if (!imageUploaded) return toast.warning("image not uploaded");

    try {
      const fileName = "Image-" + user._id + ".jpg";
      const response = await getUploadUrl(fileName, "image/jpeg");

      if (response.success) {
        const { uploadUrl } = response;

        if (!uploadUrl)
          return toast.error("didn't get url for the image upload");

        await uploadFileToS3(uploadUrl, imageUploaded);

        const newProfilePictureUrl = `${s3Url}/Image-${user._id}.jpg`;

        setUser((prevUser) => ({
          ...prevUser,
          avatar: newProfilePictureUrl,
        }));

        setAvatarPreview(null);
        setImageUploaded(null);

        toast.success("Profile picture updated successfully");
      } else return toast.error("Image upload failed");
    } catch (error) {
      toast.error("Failed to update profile picture");
      console.error(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUploaded(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
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
        <div className="relative flex flex-col justify-center items-center">
          <Avatar
            className="w-24 h-24 cursor-pointer relative group"
            onClick={handleProfilePictureClick}
          >
            <AvatarImage
              src={
                avatarPreview || user.avatar || `${s3Url}/Image-${user._id}.jpg`
              }
              alt="Profile picture"
            />
            <AvatarFallback className="bg-green-400">
              {user.firstName[0].toUpperCase()}
              {user.lastName[0].toUpperCase()}
            </AvatarFallback>

            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white text-sm font-medium">Change</span>
            </div>
          </Avatar>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            aria-label="Change profile picture"
          />
          {imageUploaded && (
            <button
              onClick={handleSaveImage}
              className="px-1 py-1 mt-3 text-xs text-white rounded bg-violet-950 hover:bg-violet-900 transition-colors duration-300"
            >
              Save Image
            </button>
          )}
        </div>

        {/* Rest of the form fields remain the same */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={user.firstName}
              onChange={handleInputChange}
              className="border border-gray-800 text-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={user.lastName}
              onChange={handleInputChange}
              className="border border-gray-800 text-gray-400"
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
            className="border border-gray-800 text-gray-400"
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
            className="border border-gray-800 text-gray-400"
          />
        </div>
        <div>
          <Label htmlFor="tenant_id">Tenant ID</Label>
          <Input
            id="tenant_id"
            name="tenant_id"
            value={user.tenant_id}
            onChange={handleInputChange}
            className="border border-gray-800 text-gray-400"
          />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={user.phoneNumber}
            onChange={handleInputChange}
            className="border border-gray-800 text-gray-400"
          />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            name="role"
            value={user.role}
            onChange={handleInputChange}
            className="border border-gray-800 text-gray-400"
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
