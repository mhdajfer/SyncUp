"use client";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { createUser } from "@/api/userService/user";
import { useRouter } from "next/navigation";
import { z, ZodError } from "zod";
import { useForm } from "react-hook-form";
import { User } from "@/interfaces/User";
import { zodResolver } from "@hookform/resolvers/zod";

const userSchema = z
  .object({
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
      .min(4, "password should be at least 6 characters long"),
    confirmPassword: z
      .string()
      .trim()
      .min(4, "password should be at least 6 characters long"),
    age: z.coerce.number().gt(5).lt(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignupForm() {
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
    try {
      const { firstName, lastName, email, phoneNumber, age, password } =
        getValues();
      // const response = await createUser({
      //   firstName,
      //   lastName,
      //   email,
      //   phoneNumber,
      //   role: "manager",
      //   age,
      //   password,
      // });

      // if (response.success) {
      //   toast.success(response.message);
      //   console.log("signup successful");

      //   router.push("/employee/login");
      // }

      console.log(firstName, lastName, email, phoneNumber, password, age);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
      }
    }
    toast.success("Signup successful!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 py-20">
      <div className=" max-w-lg w-[500px] bg-gradient-to-br from-[#111827] to-[#1F2937] shadow-lg rounded-lg p-8 text-white">
        <h2 className="text-3xl font-semibold text-center mb-4">Signup</h2>
        <p className="text-center mb-6 text-gray-400">
          Just some details to get you in.!
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="flex space-x-4">
            <div className="w-1/2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                placeholder="First Name"
                {...register("firstName")}
                className="mt-1"
                required
              />
              {errors.firstName && (
                <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md w-full">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="w-1/2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                id="lastName"
                placeholder="Last Name"
                {...register("lastName")}
                className="mt-1"
                required
              />
              {errors.lastName && (
                <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              {...register("email")}
              className="mt-1"
              required
            />
            {errors.email && (
              <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Input
              type="text"
              id="role"
              name="role"
              placeholder="Role"
              defaultValue={"manager"}
              className="mt-1"
              required
            />
          </div>
          <div className="flex space-x-6">
            <div className="w-1/2">
              <Label htmlFor="role">Age</Label>
              <Input
                type="number"
                id="age"
                placeholder="Age"
                {...register("age")}
                className="mt-1"
                required
              />
              {errors.age && (
                <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md">
                  {errors.age.message}
                </p>
              )}
            </div>
            <div className="w-1/2">
              <Label htmlFor="role">Phone no.</Label>
              <Input
                type="number"
                id="phoneNumber"
                placeholder="Phone Number"
                {...register("phoneNumber")}
                className="mt-1"
                required
              />
              {errors.phoneNumber && (
                <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              {...register("password")}
              className="mt-1"
              required
            />
            {errors.password && (
              <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              className="mt-1"
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-700 text-xs mt-1 bg-red-100 bg-opacity-70 py-1 px-2 rounded-md">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
          >
            Signup
          </Button>
        </form>

        <div className="flex items-center justify-between mt-6">
          <span className="border-b w-1/5 lg:w-1/4"></span>
          <p className="text-sm text-gray-400">Or signup with</p>
          <span className="border-b w-1/5 lg:w-1/4"></span>
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <Button variant="ghost">
            <FcGoogle />
          </Button>
          <Button variant="ghost">
            <FaGithub />
          </Button>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/employee/login"
            className="text-sm text-gray-400 hover:text-gray-200"
          >
            Already Registered? Login
          </Link>
        </div>
      </div>
    </div>
  );
}
