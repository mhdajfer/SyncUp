"use client";
import { getDevelopers } from "@/api/userService/user";
import UsersTable from "@/Components/Tables/UsersTable";
import { User } from "@/interfaces/User";
import { useEffect, useState } from "react";

export default function Page() {
  const [devList, setDevList] = useState<User[]>([]);

  useEffect(() => {
    async function getData() {
      const result = await getDevelopers();

      setDevList(result.data);
    }
    getData();
  }, []);

  return (
    <>
      <UsersTable usersList={devList} />
    </>
  );
}
