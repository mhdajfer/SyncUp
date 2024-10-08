"use client";
import ForgotPassword from "@/Components/ForgotPassword";
import { OtpPopup } from "@/Components/Otp/OtpPopup";
import { useState } from "react";

export default function Page() {
  const [otpPopup, setOtpPopup] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  return (
    <>
      <ForgotPassword setEmail={setEmail} setOtpPopup={setOtpPopup} />
      {/* {otpPopup ? <OtpPopup email={email} useCase="forgot-password" /> : null} */}
    </>
  );
}
