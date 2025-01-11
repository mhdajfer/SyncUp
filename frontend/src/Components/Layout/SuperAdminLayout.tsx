"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { FiUsers, FiFolder, FiUser, FiCalendar } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import { User } from "@/interfaces/User";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { S3_URL } from "@/Consts";

const ROUTE_MAP = {
  subscriptions: "/super-admin/subscriptions",
  tenants: "/super-admin/tenants",
  chat: "/super-admin/chat",
  meeting: "/super-admin/meeting",
  profile: "/super-admin/profile",
} as const;

type RouteKey = keyof typeof ROUTE_MAP;

export function SuperAdminLayout({
  logoutSuccess,
  user,
}: {
  logoutSuccess: () => void;
  user: User;
}) {
  const router = useRouter();

  function onSideBarClick(val: RouteKey) {
    try {
      const path = ROUTE_MAP[val];
      router.push(path);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }

  const handleLogout = (): void => {
    try {
      logoutSuccess();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-gray-200 relative">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <h1 className="text-xl font-bold">SyncUp</h1>
      </div>

      <nav className="mt-10">
        <SideBarItem
          icon={<FiUsers />}
          label="Subscriptions"
          onClick={() => onSideBarClick("subscriptions")}
        />
        <SideBarItem
          icon={<FiUser />}
          label="Tenants"
          onClick={() => onSideBarClick("tenants")}
        />
        <SideBarItem
          icon={<FiFolder />}
          label="chat"
          onClick={() => onSideBarClick("chat")}
        />
        <SideBarItem
          icon={<FiCalendar />}
          label="Meetings"
          onClick={() => onSideBarClick("meeting")}
        />
      </nav>

      <div className="absolute place-content-between bottom-0 flex items-center p-4 border-t border-gray-700 w-full">
        <div className="flex">
          <div>
            <Avatar className=" cursor-pointer ">
              <AvatarImage
                src={`${S3_URL}/Image-${
                  user._id
                }.jpg?t=${new Date().getTime()}`}
                alt="Profile picture"
                className="w-12 h-12 bg-cover  rounded-full"
              />
              <AvatarFallback className=" bg-green-400 rounded-full p-2">
                {user.firstName[0].toUpperCase()}
                {user.lastName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div
            className="ml-3 cursor-pointer"
            onClick={() => onSideBarClick("profile")}
          >
            <p className="text-sm font-medium hover:underline">
              {user.firstName}
            </p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
        <div
          className="cursor-pointer hover:bg-slate-700 rounded"
          onClick={handleLogout}
        >
          <CiLogout size={25} />
        </div>
      </div>
    </div>
  );
}

interface SideBarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const SideBarItem: FC<SideBarItemProps> = ({ icon, label, onClick }) => (
  <div
    className="flex items-center p-2 text-sm font-medium cursor-pointer hover:bg-gray-700"
    onClick={onClick}
  >
    {icon}
    <span className="ml-4">{label}</span>
  </div>
);

export default SuperAdminLayout;
