"use client";
import SignupForm from "@/Components/Forms/SignupForm";
import { OtpPopup } from "@/Components/Otp/OtpPopup";
import { useState } from "react";

export default function Page() {
  const [otpPopup, setOtpPopup] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  console.log(process.env.NEXT_PUBLIC_NEXTAUTH_URL);
  return (
    <>
      <div className="">
        <SignupForm
          setOtpPopup={setOtpPopup}
          setEmail={setEmail}
          role={"tenant-admin"}
        />
        {otpPopup ? <OtpPopup email={email} /> : null}
      </div>
    </>
  );
}
