"use client";

import React, { useEffect, useState } from "react";
import DevLayout from "@/Components/Layout/DevLayout";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import Loading from "@/./Components/Loading/Loading";

const SideBar = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("not authenticated");
      router.push("/employee/login");
    } else setLoading(false);
  }, [isAuthenticated, router, loading]);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex">
          <DevLayout />
          <div>{children}</div>
        </div>
      )}
    </>
  );
};

export default SideBar;
