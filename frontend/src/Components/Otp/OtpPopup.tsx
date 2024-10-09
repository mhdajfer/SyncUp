"use client";

import { useEffect, useState } from "react";
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
  const [timer, setTimer] = useState(10);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  async function handleSubmit(inputValue: string) {
    try {
      console.log("Submitted OTP:", inputValue, email);

      const response: { data: { success: boolean; message: string } } =
        await userInstance.post("/users/verifyOtp", { email, otp: inputValue });

      console.log(response);

      if (response.data.success) {
        toast.success(response.data.message);
        console.log("Verified");

        router.push("/admin/dashboard");
      } else {
        toast.error(response.data.message);
        router.push("/admin/signup");
      }
    } catch (error) {
      console.log(error);
      toast.error(`something went wrong`);
    }
  }

  async function handleResend() {
    try {
      if (!isResendDisabled) {
        setTimer(10);
        setIsResendDisabled(true);

        console.log("resent.....");

        const response = await userInstance.post("/users/otp/new", { email });

        console.log(response);

        if (response.data.success) {
          toast.success("OTP has been resent");
        } else {
          toast.error("Failed to resend OTP");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong while resending OTP");
    }
  }

  return (
    <div className="space-y-2 fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm text-white">
      <h1>One time password has send to : {email}</h1>
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
      <div className="flex items-center justify-center mt-4">
        <span className="text-orange-600 text-sm">
          {timer > 0
            ? `Resend OTP in ${timer} seconds`
            : "You can now resend the OTP."}
        </span>
        <button
          onClick={handleResend}
          disabled={isResendDisabled}
          className={`ml-4 px-4 py-2 text-sm font-bold text-white rounded-md ${
            isResendDisabled
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-800 hover:bg-blue-900"
          }`}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
}
