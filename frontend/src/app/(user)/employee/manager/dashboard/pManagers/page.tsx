"use client";
import { getProjectManagers } from "@/api/userService/user";
import UsersTable from "@/Components/Tables/UsersTable";
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
      <UsersTable usersList={managersList} />
    </>
  );
}
