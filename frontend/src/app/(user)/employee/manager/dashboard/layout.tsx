"use client";
import ManagerLayout from "@/Components/Layout/ManagerLayout";
import { logoutSuccess } from "@/store/slices/authSlice";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <div className="w-fit bg-blue-800">
        <ManagerLayout logoutSuccess={logoutSuccess} />
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default Layout;
