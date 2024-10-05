"use client";
import { getProjectManagers } from "@/api/userService/user";
import { UsersTable01 } from "@/Components/Tables/UsersTable01";
import { User } from "@/interfaces/User";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [managersList, setManagersList] = useState<User[]>([]);

  useEffect(() => {
    async function getData() {
      try {
        const data = await getProjectManagers();

        setManagersList(data.data);
      } catch (error) {
        toast("No users found in current tenant");
        console.log(error);
      }
    }
    getData();
  }, []);

  return (
    <>
      <UsersTable01 usersList={managersList} />
    </>
  );
}
