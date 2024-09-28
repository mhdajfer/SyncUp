"use client";
import { getAllUsers } from "@/api/userService/user";
import { UsersTable01 } from "@/Components/Tables/UsersTable01";
import { User } from "@/interfaces/User";
import { useEffect, useState } from "react";

export default function Page() {
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    async function getData() {
      const usersList = await getAllUsers();
      setUserList(usersList.data);
    }
    getData();
  }, []);
  return (
    <>
      <div className="">
        <h1 className="text-white">Users</h1>

        <UsersTable01 usersList={userList} />
      </div>
    </>
  );
}
