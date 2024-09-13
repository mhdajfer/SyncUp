"use client";
import React, { useState } from "react";
import Login from "../../../../Components/Login/Login";
import { login } from "@/api/userService/user";
import { User } from "../../../../interfaces/User";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/app/store/store";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/app/store/slices/authSlice";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with", { email, password });

    const data: { success: boolean; user: User; accessToken: string } =
      await login({
        username: email,
        password,
      });

    if (!data.success) throw new Error("login failed");

    localStorage.setItem("accessToken", data.accessToken);
    console.log("logged in successfully.......");
    dispatch(loginSuccess({ accessToken: data.accessToken, user: data.user }));
    router.push("dev/dashboard");
  };

  return (
    <Login
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};

export default Page;
