"use client";
import { getDevelopers } from "@/api/userService/user";
import UsersTable from "@/Components/Tables/UsersTable";
import { User } from "@/interfaces/User";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
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
      <div className="my-4 w-full flex justify-end pe-14">
        <button
          type="button"
          className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-200 font-medium rounded-lg text-sm px-2 py-1 me-2"
          onClick={() => router.push("developers/create")}
        >
          Add Developer
        </button>
      </div>
      <UsersTable usersList={devList} />
    </>
  );
}
