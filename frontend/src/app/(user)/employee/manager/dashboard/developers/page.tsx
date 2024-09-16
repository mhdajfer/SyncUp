"use client";
import { getDevelopers } from "@/api/userService/user";
import ManagerDevelopersTable from "@/Components/Tables/ManagerDevelopersTable";
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

  console.log(devList);

  return (
    <>
      <ManagerDevelopersTable developerList={devList} />
    </>
  );
}
