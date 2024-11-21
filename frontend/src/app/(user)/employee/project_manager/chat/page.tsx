"use client";
import { getAllUsers } from "@/api/userService/user";
import ChatUI from "@/Components/Chat/ChatUI";
import { User } from "@/interfaces/User";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const getUsers = async () => {
    try {
      const response = await getAllUsers();

      console.log(response.data);

      if (response.success) setUsers(response.data);
    } catch (error) {
      toast.error("can't fetch all users");
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);
  return <ChatUI users={users} />;
}
