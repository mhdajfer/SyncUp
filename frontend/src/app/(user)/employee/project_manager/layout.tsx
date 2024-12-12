"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Loading from "@/./Components/Loading/Loading";
import { logoutSuccess } from "@/store/slices/authSlice";
import PManagerLayout from "@/Components/Layout/PManagerLayout";
import { toast } from "sonner";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("not authenticated");
      router.push("/login");
    } else if (!(user?.role == "pManager")) {
      router.back();
    } else setLoading(false);
  }, [isAuthenticated, router, loading, user?.role]);

  if (!user) toast.error("user not found");

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
            {user && (
              <PManagerLayout logoutSuccess={handleLogout} user={user} />
            )}
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
