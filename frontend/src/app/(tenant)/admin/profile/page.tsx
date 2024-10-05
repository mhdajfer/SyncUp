"use client";
import ShowProfile from "@/Components/Profile/ShowProfile";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function Page() {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user);

  if (!user) return toast.error("User not found");

  return (
    <>
      <ShowProfile initialUser={user} />
    </>
  );
}
