"use client";
import ManagerLayout from "@/Components/Layout/ManagerLayout";
import { logoutSuccess } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const dispatch: AppDispatch = useDispatch();
  function handleLogout() {
    console.log("logout");
    dispatch(logoutSuccess());
  }
  return (
    <div className="flex">
      <div className="w-fit bg-blue-800 fixed">
        <ManagerLayout logoutSuccess={handleLogout} />
      </div>
      <div className="ml-64 bg-[#082032] w-full p-6 px-4 overflow-y-scroll">
        {children}
      </div>
    </div>
  );
};

export default Layout;
