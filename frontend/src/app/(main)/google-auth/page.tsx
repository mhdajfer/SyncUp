"use client";
import { googleSignup } from "@/api/userService/user";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { loginSuccess } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";

export default function GoogleLogin() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  useEffect(() => {
    const login = async () => {
      if (status === "authenticated") {
        const user = session?.user as {
          email: string;
          image: string;
          name: string;
        };
        try {
          const response = await googleSignup(user);
          console.log(
            `google user is ${user},  response from the login api is ${response}`
          );

          if (response.success) {
            Cookies.set("accessToken", response.accessToken);
            localStorage.setItem("refreshToken", response.refreshToken);

            console.log("logged in successfully.......", response.user.role);
            dispatch(
              loginSuccess({
                accessToken: response.accessToken,
                user: response.user,
              })
            );
            router.push("/admin/dashboard");
          }
        } catch (error) {
          console.error("Error during login:", error);
          router.push("/login");
        }
      } else if (status === "unauthenticated") {
        router.push("/login");
      }
    };

    login();
  }, [status, session, router]);

  return <div>Logging in...</div>;
}
