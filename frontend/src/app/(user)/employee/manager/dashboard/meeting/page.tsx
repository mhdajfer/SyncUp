"use client";
import { getAllUsers } from "@/api/userService/user";
import { VideoCall } from "@/Components/Meeting/VideoCall";
import { User } from "@/interfaces/User";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function Page() {
  const [userList, setUserList] = useState<User[]>([]);
  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);

  useEffect(() => {
    async function getData() {
      try {
        const usersList = await getAllUsers();
        setUserList(
          usersList.data.filter((user) => user._id !== currentUserId)
        );
      } catch (error: unknown) {
        console.log(error);

        toast.info("No users found");
      }
    }
    getData();
  }, [currentUserId]);
  return <VideoCall users={userList} />;
}
