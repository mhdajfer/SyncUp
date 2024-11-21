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
          toast.error(errorData.error || "Error occured");
        }
      }
      console.log("Error logging in", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          Welcome Back
        </h2>

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
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <FaRegEye className="h-5 w-5 text-gray-400" />
                ) : (
                  <FaRegEyeSlash className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a
                href="forgotPassword"
                className="font-medium text-indigo-500 hover:text-indigo-400"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Dont have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-indigo-500 hover:text-indigo-400"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
