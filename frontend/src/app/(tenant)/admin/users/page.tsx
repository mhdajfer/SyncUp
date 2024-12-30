"use client";
import { getAllUsers } from "@/api/userService/user";
import UserTableWithSearch from "@/Components/Tables/UserTableWrapper";
import { User } from "@/interfaces/User";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    async function getData() {
      try {
        const usersList = await getAllUsers();
        setUserList(
          usersList.data.filter((user) => user._id !== currentUserId)
        );
      } catch (error: unknown) {
        console.log(error);

        toast.info("No users found");
      }
    }
    getData();
  }, [currentUserId]);
  return (
    <>
      <div className="w-full">
        <div className="my-4 w-full flex justify-end pe-8">
          <button
            type="button"
            className="text-slate-100 bg-blue-800 border border-none hover:bg-blue-900 font-medium rounded-md text-sm px-2 py-1 me-2"
            onClick={() => router.push("users/invite")}
          >
            Add User
          </button>
        </div>

        <UserTableWithSearch users={userList} />
      </div>
    </>
  );
}
