"use server";
import { signIn } from "@/auth";

export async function SignIn() {
  try {
    await signIn("google", {
      redirectTo: "/google-auth",
      redirect: true,
    });
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
}