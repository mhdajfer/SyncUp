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
      if (status === "authenticated" && session?.user) {
        const user = session.user as {
          email: string;
          image: string;
          name: string;
        };

        try {
          const response = await googleSignup(user);

          if (response.success) {
            // Set tokens
            Cookies.set("accessToken", response.accessToken, {
              secure: true,
              sameSite: "strict",
            });
            localStorage.setItem("refreshToken", response.refreshToken);

            // Update Redux state
            dispatch(
              loginSuccess({
                accessToken: response.accessToken,
                user: response.user,
              })
            );

            // Redirect to dashboard
            router.replace("/admin/dashboard");
            return;
          }

          // If response.success is false
          router.replace("/login");
        } catch (error) {
          console.error("Error during Google login:", error);
          router.replace("/login");
        }
      } else if (status === "unauthenticated") {
        router.replace("/login");
      }
    };

    login();
  }, [status, session, router, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">Logging in...</div>
    </div>
  );
}
