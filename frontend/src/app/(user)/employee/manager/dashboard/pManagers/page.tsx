"use client";
import { getProjectManagers } from "@/api/userService/user";
import { UsersTable01 } from "@/Components/Tables/UsersTable01";
import { User } from "@/interfaces/User";
import { useEffect, useState } from "react";

export default function Page() {
  const [managersList, setManagersList] = useState<User[]>([]);

  useEffect(() => {
    async function getData() {
      const data = await getProjectManagers();

      setManagersList(data.data);
    }
    getData();
  }, []);

  return (
    <>
      
      <UsersTable01 usersList={managersList} />
    </>
  );
}
