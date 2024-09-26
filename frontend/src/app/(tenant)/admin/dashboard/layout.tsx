"use client";
import { logoutSuccess } from "@/store/slices/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Loading from "@/Components/Loading/Loading";
import TenantAdminLayout from "@/Components/Layout/TenantAdminLayout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  //   const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  //   const isAuthenticated = useSelector(
  //     (state: RootState) => state.auth.isAuthenticated
  //   );
  function handleLogout() {
    console.log("logout");
    dispatch(logoutSuccess());
  }

  //   useEffect(() => {
  //     if (!isAuthenticated) {
  //       console.log("not authenticated");
  //       router.push("/employee/login");
  //       setTimeout(() => {
  //         toast.error("You must log in");
  //       }, 1000);
  //     } else setLoading(false);
  //   }, [isAuthenticated, router, loading]);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex ">
          <div className="w-fit  fixed">
            <TenantAdminLayout logoutSuccess={handleLogout} />
          </div>
          <div className="ml-64 bg-[#082032] flex flex-col items-center justify-center w-full h-screen py-10 px-4  overflow-y-scroll">
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Layout;
