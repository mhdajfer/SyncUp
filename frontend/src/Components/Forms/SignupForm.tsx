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
import { z, ZodError } from "zod";
import { useForm } from "react-hook-form";
import { User } from "@/interfaces/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { userInstance } from "@/axios";
import { AxiosError } from "axios";
import { SignIn } from "@/lib/auth.action";
import { motion } from "framer-motion";

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
      .min(6, "password should be at least 6 characters long"),
    confirmPassword: z
      .string()
      .trim()
      .min(6, "password should be at least 6 characters long"),
    age: z.coerce.number().gt(5).lt(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignupForm({
  setOtpPopup,
  setEmail,
  role,
}: {
  setOtpPopup: (value: boolean) => void;
  setEmail: (value: string) => void;
  role: string;
}) {
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
    const { firstName, lastName, email, phoneNumber, age, password } =
      getValues();

    try {
      const response = await createUser({
        userData: {
          firstName,
          subscriptionStatus: false,
          lastName,
          email,
          phoneNumber,
          role: role,
          age,
          password,
          status: "Invited",
        },
      });

      setEmail(email);
      if (response.success) {
        toast.success(response.message);
        console.log("signup successful");
        setTimeout(() => setOtpPopup(true), 2000);
      } else if (
        !response.success &&
        response.message.includes("not verified")
      ) {
        console.log(`already signed up but: ${response.message}`);
        toast.error(`${response.message}`);
        await userInstance.post("/users/otp/new", { email });
        setOtpPopup(true);
      } else {
        toast.error(`${response.message}`);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
      } else if (error instanceof AxiosError) {
        toast.warning("User already exists");
      } else toast.error("user not created, something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-indigo-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-lg w-[500px] bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl shadow-2xl rounded-2xl p-8 text-white border border-gray-800 my-10"
      >
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-2 mt-6 bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
          Join SyncUp
        </h2>
        <p className="text-center mb-8 text-gray-400">
          Begin your journey with us!
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-gray-300">
                First Name
              </Label>
              <Input
                type="text"
                id="firstName"
                {...register("firstName")}
                className="mt-1 bg-gray-800/50 border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName" className="text-gray-300">
                Last Name
              </Label>
              <Input
                type="text"
                id="lastName"
                {...register("lastName")}
                className="mt-1 bg-gray-800/50 border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              {...register("email")}
              className="mt-1 bg-gray-800/50 border-gray-700 focus:border-purple-500 focus:ring-purple-500"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age" className="text-gray-300">
                Age
              </Label>
              <Input
                type="number"
                id="age"
                {...register("age")}
                className="mt-1 bg-gray-800/50 border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                placeholder="25"
              />
              {errors.age && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.age.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phoneNumber" className="text-gray-300">
                Phone Number
              </Label>
              <Input
                type="tel"
                id="phoneNumber"
                {...register("phoneNumber")}
                className="mt-1 bg-gray-800/50 border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                placeholder="+1234567890"
              />
              {errors.phoneNumber && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              {...register("password")}
              className="mt-1 bg-gray-800/50 border-gray-700 focus:border-purple-500 focus:ring-purple-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-gray-300">
              Confirm Password
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword")}
              className="mt-1 bg-gray-800/50 border-gray-700 focus:border-purple-500 focus:ring-purple-500"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transform hover:scale-[1.02] transition-all duration-200"
          >
            Create Account
          </Button>
        </form>

        <div className="relative flex items-center justify-center mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative bg-transparent px-4">
            <span className="text-sm text-gray-400">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1">
          <Button
            type="button"
            onClick={async () => {
              try {
                await SignIn();
              } catch (error) {
                toast.error("Could not sign in, please try again later");
                console.error("Login failed:", error);
              }
            }}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
          >
            <FcGoogle className="w-5 h-5" />
            Google
          </Button>
          {/* <Button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
          >
            <FaGithub className="w-5 h-5" />
            GitHub */}
          {/* </Button> */}
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
