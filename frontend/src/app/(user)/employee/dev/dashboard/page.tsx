"use client";
import { RootState } from "@/app/store/store";
import { FC } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const Page: FC = () => {
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!isAuthenticated) {
    console.log("not authenticated");
    router.push("/employee/login");
  }
  return (
    <>
      <h1 className="bg-red-600 w-screen">Developer</h1>
    </>
  );
};

export default Page;
