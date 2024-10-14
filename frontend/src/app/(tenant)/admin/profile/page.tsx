"use client";
import { getUser } from "@/api/userService/user";
import ShowProfile from "@/Components/Profile/ShowProfile";
import { User } from "@/interfaces/User";
import { RootState } from "@/store/store";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function Page() {
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  const [user, setUser] = useState<User>();

  useEffect(() => {
    getUserData();
  });

  async function getUserData() {
    try {
      if (!userId) return toast.error("user not authenticated");

      const response = await getUser(userId);

      if (response.success) {
        setUser(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("error while retrieving user");
        console.log(error);
      }
    }
  }

  return <>{user && <ShowProfile initialUser={user} />}</>;
}
