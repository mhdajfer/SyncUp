"use client";
import { logoutSuccess } from "@/store/slices/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import TenantAdminLayout from "@/Components/Layout/TenantAdminLayout";
import Loading from "@/Components/Loading/Loading";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  function handleLogout() {
    console.log("logout");
    dispatch(logoutSuccess());
  }

  useEffect(() => {
    if (user?.role != "tenant-admin") {
      console.log("not authenticated");
      router.push("/login");
      setTimeout(() => {
        toast.error("You must log in as tenant admin");
      }, 1000);
    } else setLoading(false);
  }, [router, loading, user?.role]);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex ">
          <div className="w-fit  fixed">
            {user && (
              <TenantAdminLayout user={user} logoutSuccess={handleLogout} />
            )}
          </div>
          <div className="ml-64 bg-[#082032] min-h-screen flex flex-col items-center justify-center w-full h-full py-10 px-4  overflow-y-scroll">
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Layout;
