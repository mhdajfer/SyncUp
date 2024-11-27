import {
  FiUsers,
  FiUserCheck,
  FiFolder,
  FiMessageSquare,
  FiCalendar,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { CiLogout } from "react-icons/ci";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { User } from "@/interfaces/User";

export default function PManagerLayout({
  logoutSuccess,
  user,
}: {
  logoutSuccess: () => void;
  user: User;
}) {
  const router = useRouter();
  return (
    <div className="h-screen w-64 bg-gray-900 text-gray-200 relative">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <h1 className="text-xl font-bold">SyncUp</h1>
      </div>

      <nav className="mt-10">
        <SideBarItem
          icon={<FiUsers />}
          label="Dashboard"
          onClick={() => router.push("/employee/project_manager/dashboard")}
        />
        <SideBarItem
          icon={<FiUsers />}
          label="Developers"
          onClick={() => router.push("/employee/project_manager/developers")}
        />
        <SideBarItem
          icon={<FiUserCheck />}
          label="Tasks"
          onClick={() => router.push("/employee/project_manager/tasks")}
        />
        <SideBarItem
          icon={<FiFolder />}
          label="Projects"
          onClick={() => router.push("/employee/project_manager/projects")}
        />
        <SideBarItem
          icon={<FiMessageSquare />}
          label="Chats"
          onClick={() => router.push("/employee/project_manager/chat")}
        />
        <SideBarItem
          icon={<FiCalendar />}
          label="Meetings"
          onClick={() => router.push("/employee/project_manager/meeting")}
        />
      </nav>

      <div className="absolute place-content-between bottom-0 flex items-center p-4 border-t border-gray-700 w-full">
        <div className="flex">
          <div>
            <Avatar className=" cursor-pointer ">
              <AvatarImage
                src={user.avatar}
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
            onClick={() => router.push("/employee/project_manager/profile")}
          >
            <p className="text-sm font-medium hover:underline">
              {user.firstName}
            </p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
        <div
          className="cursor-pointer hover:bg-slate-700 rounded"
          onClick={() => {
            logoutSuccess();
          }}
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
