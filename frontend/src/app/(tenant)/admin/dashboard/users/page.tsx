"use client";
import { getAllUsers } from "@/api/userService/user";
import { UsersTable01 } from "@/Components/Tables/UsersTable01";
import { User } from "@/interfaces/User";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    async function getData() {
      try {
        const usersList = await getAllUsers();
        setUserList(usersList.data);
      } catch (error: unknown) {
        console.log(error);

        toast("No users found");
      }
    }
    getData();
  }, []);
  return (
    <>
      <div className="">
        <div className="my-4 w-full flex justify-end pe-8">
          <button
            type="button"
            className="text-slate-100 bg-blue-800 border border-none hover:bg-blue-900 font-medium rounded-md text-sm px-2 py-1 me-2"
            onClick={() => router.push("users/invite")}
          >
            Add User
          </button>
        </div>

        <UsersTable01 usersList={userList} />
      </div>
    </>
  );
}
