"use client";

import { login } from "@/api/userService/user";
import { User } from "@/interfaces/User";
import { loginSuccess } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { AxiosError } from "axios";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Logging in with", { email, password });

    try {
      const data: {
        success: boolean;
        user: User;
        accessToken: string;
        refreshToken: string;
        message?: string;
      } = await login({
        username: email,
        password,
      });

      if (!data.success) {
        return toast.error(data.message);
      }

      Cookies.set("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      console.log("logged in successfully.......", data.user.role);
      dispatch(
        loginSuccess({ accessToken: data.accessToken, user: data.user })
      );

      switch (data.user.role) {
        case "manager":
          router.push("employee/manager/dashboard");
          break;
        case "dev":
          router.push("employee/dev/dashboard");
          break;
        case "pManager":
          router.push("employee/project_manager/dashboard");
          break;
        case "tenant-admin":
          router.push("/admin/dashboard");
          break;
        case "sAdmin":
          router.push("/super-admin/dashboard");
          break;
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const errorData = error.response.data;
          toast.error(errorData.error || "Error occurred");
        }
      }
      console.log("Error logging in", error);
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
        className="relative max-w-md w-full bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl shadow-2xl rounded-2xl p-8 text-white border border-gray-800"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
          Welcome Back
        </h2>
        <p className="text-center mb-8 text-gray-400">
          Sign in to continue to SyncUp
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <FaRegEye className="h-5 w-5" />
                ) : (
                  <FaRegEyeSlash className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/forgotPassword"
              className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-[1.02] transition-all duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="relative flex items-center justify-center mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative bg-transparent px-4">
            <span className="text-sm text-gray-400">New to SyncUp?</span>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          {` Don't have an account?${" "}`}
          <Link
            href="/signup"
            className="font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            Sign up now
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
