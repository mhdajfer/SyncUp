"use client";
import { getProjectManagers } from "@/api/userService/user";
import UsersTable from "@/Components/Tables/UsersTable";
import { User } from "@/interfaces/User";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
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
      <div className="my-4 w-full flex justify-end pe-14">
        <button
          type="button"
          className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-200 font-medium rounded-lg text-sm px-2 py-1 me-2"
          onClick={() => router.push("pManagers/create")}
        >
          Add Project Manager
        </button>
      </div>
      <UsersTable usersList={managersList} />
    </>
  );
}
