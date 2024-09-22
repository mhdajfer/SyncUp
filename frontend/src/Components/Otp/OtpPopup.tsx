"use client";

import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/Components/ui/input-otp";
import { toast } from "sonner";
import { userInstance } from "@/axios";
import { useRouter } from "next/navigation";

export function OtpPopup({ email }: { email: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  async function handleSubmit(inputValue: string) {
    try {
      console.log("Submitted OTP:", inputValue, email);

      const response: { data: { success: boolean; message: string } } =
        await userInstance.post("/users/verifyOtp", { email, otp: inputValue });

      console.log(response);

      if (response.data.success) {
        toast.success(response.data.message);
        console.log("Verified");

        router.push("/employee/login");
      } else {
        toast.error(response.data.message);
        router.push("/employee/signup");
      }
    } catch (error) {
      console.log(error);
      toast.error(`something went wrong`);
    }
  }

  return (
    <div className="space-y-2 fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <InputOTP
        maxLength={4}
        value={value}
        onChange={(inputValue) => {
          setValue(inputValue);
          if (inputValue.length === 4) handleSubmit(inputValue);
        }}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
      <div className="text-center text-sm">
        {value === "" ? (
          <>Enter your one-time password.</>
        ) : (
          <>You entered: {value}</>
        )}
      </div>
    </div>
  );
}
