"use client";

import React, { useEffect, useState } from "react";
import DevLayout from "@/Components/Layout/DevLayout";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Loading from "@/./Components/Loading/Loading";
import { logoutSuccess } from "@/store/slices/authSlice";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("not authenticated");
      router.push("/login");
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
          <div className="w-fit fixed">
            <DevLayout logoutSuccess={handleLogout} />
          </div>
          <div className="ml-64 bg-[#082032] min-h-screen flex flex-col items-center justify-center w-full h-full py-10 px-4  overflow-y-scroll">
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Layout;
