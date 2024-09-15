"use client"; // Add this at the top to make it a client component

import { FC } from "react";
import { useRouter } from "next/navigation";
import {
  FiUsers,
  FiFolder,
  FiMessageSquare,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

const SideBar: FC = () => {
  const router = useRouter();

  return (
    <div className="h-screen w-64 bg-gray-900 text-gray-200">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <h1 className="text-xl font-bold">SyncUp</h1>
      </div>

      <nav className="mt-10">
        <SideBarItem
          icon={<FiUsers />}
          label="Developers"
          onClick={() => router.push("/developers")}
        />
        <SideBarItem
          icon={<FiUser />}
          label="Project Managers"
          onClick={() => router.push("/project-managers")}
        />
        <SideBarItem
          icon={<FiFolder />}
          label="Projects"
          onClick={() => router.push("/projects")}
        />

        <SideBarItem
          icon={<FiMessageSquare />}
          label="Chats"
          onClick={() => router.push("/chats")}
        />
        <SideBarItem
          icon={<FiCalendar />}
          label="Meetings"
          onClick={() => router.push("/meetings")}
        />
        <Link href="/login">login</Link>
      </nav>

      <div className="absolute bottom-0 flex items-center p-4 border-t border-gray-700 w-full">
        <Image
          className="rounded-full"
          src="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg" // Add the profile image
          alt="Profile"
          width={40}
          height={40}
        />
        <div className="ml-3">
          <p className="text-sm font-medium">Ram</p>
          <p className="text-xs text-gray-400">ram@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

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

export default SideBar;
