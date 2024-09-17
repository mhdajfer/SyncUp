"use client";
import ManagerLayout from "@/Components/Layout/ManagerLayout";
import { logoutSuccess } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { Toaster } from "sonner";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const dispatch: AppDispatch = useDispatch();
  function handleLogout() {
    console.log("logout");
    dispatch(logoutSuccess());
  }
  return (
    <div className="flex ">
      <div className="w-fit  fixed">
        <ManagerLayout logoutSuccess={handleLogout} />
      </div>
      <div className="ml-64 bg-[#082032] flex flex-col items-center justify-center w-full h-screen py-10 px-4  overflow-y-scroll">
        <Toaster />
        {children}
      </div>
    </div>
  );
};

export default Layout;
