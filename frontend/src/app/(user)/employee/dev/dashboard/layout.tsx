"use client";

import React, { useEffect, useState } from "react";
import DevLayout from "@/Components/Layout/DevLayout";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Loading from "@/./Components/Loading/Loading";
import { logoutSuccess } from "@/store/slices/authSlice";

const SideBar = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useDispatch();

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

  function handleLogout() {
    console.log("logout");
    dispatch(logoutSuccess());
  }
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex">
          <DevLayout logoutSuccess={handleLogout} />
          <div>{children}</div>
        </div>
      )}
    </>
  );
};

export default SideBar;
