"use client";
import React, { useState } from "react";
import Login from "../../../../../Components/Login/Login";
import { login } from "@/api/userService/user";
import { User } from "../../../../../interfaces/User";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/slices/authSlice";
import Cookies from "js-cookie";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Logging in with", { email, password });

    const data: {
      success: boolean;
      user: User;
      accessToken: string;
      refreshToken: string;
    } = await login({
      username: email,
      password,
    });

    if (!data.success) throw new Error("login failed");

    Cookies.set("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    console.log("logged in successfully.......", data.user.role);
    dispatch(loginSuccess({ accessToken: data.accessToken, user: data.user }));
    switch (data.user.role) {
      case "manager":
        router.push("manager/dashboard");
        break;
      case "dev":
        router.push("dev/dashboard");
        break;
      case "pManager":
        router.push("project_manager/dashboard");
        break;
    }
  };

  return (
    <>
      <Login
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default Page;
