"use client";

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
import { createUser } from "@/api/userService/user";
import { useRouter } from "next/navigation";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

const userSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, "firstName must be at least 3 characters long")
    .regex(/^[a-zA-Z\s]+$/, "Name must only contain letters and spaces"),
  lastName: z
    .string()
    .trim()
    .min(3, "lastName must be at least 3 characters long")
    .regex(/^[a-zA-Z\s]+$/, "Name must only contain letters and spaces"),
  email: z.string().trim().email("Invalid email address"),
  phoneNumber: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 6 characters long"),

  password: z
    .string()
    .trim()
    .min(6, "password should be at least 6 characters long"),
  age: z.coerce.number().gt(5).lt(100),
});

export default function UserForm({ role }: { role: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
  });

  const onSubmit = async () => {
    const { firstName, lastName, age, email, password, phoneNumber } =
      getValues();

    try {
      const response = await createUser({
        firstName,
        lastName,
        age,
        email,
        password,
        phoneNumber,
        role: role,
      });
      if (response.success) {
        toast.success("User created successfully");
        router.push(
          role == "dev"
            ? "/employee/manager/dashboard/developers"
            : "/employee/manager/dashboard/pManagers"
        );
      } else {
        toast.error(`User creation failed : ${response.message}`);
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      console.log(error);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl text-sm bg-[#2C394B] text-white py-10">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Enter first name"
                {...register("firstName")}
                required
              />
              {errors.firstName && (
                <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md w-full">
                  {errors.firstName.message || ""}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Enter last name"
                {...register("lastName")}
                required
              />
              {errors.lastName && (
                <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md w-full">
                  {errors.lastName.message || ""}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              {...register("email")}
              required
            />
            {errors.email && (
              <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md w-full">
                {errors.email.message || ""}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              {...register("password")}
              required
            />
            {errors.password && (
              <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md w-full">
                {errors.password.message || ""}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age"
                {...register("age")}
                required
              />
              {errors.age && (
                <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md w-full">
                  {errors.age.message || ""}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="number"
                placeholder="Enter phone number"
                {...register("phoneNumber")}
                required
              />
              {errors.phoneNumber && (
                <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md w-full">
                  {errors.phoneNumber.message || ""}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select {...register("role")}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={role}>
                  {role == "dev" ? "Developer" : "Project Manager"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Invite User
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
