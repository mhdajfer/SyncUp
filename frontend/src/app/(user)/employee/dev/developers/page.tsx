"use client";
import { getDevelopers } from "@/api/userService/user";
import UserTableWithSearch from "@/Components/Tables/UserTableWrapper";
import { User } from "@/interfaces/User";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Page() {
  const [devList, setDevList] = useState<User[]>([]);
  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);

  useEffect(() => {
    async function getData() {
      const result = await getDevelopers();

      setDevList(result.data.filter((user) => user._id !== currentUserId));
    }
    getData();
  }, [currentUserId]);

  return (
    <>
      <UserTableWithSearch users={devList} />
    </>
  );
}
