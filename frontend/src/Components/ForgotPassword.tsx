"use client";

import Image from "next/image";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import forgotPasswordImg from "../../public/12953573_Data_security_05-removebg-preview 1.png";

const ForgotPassword = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="flex w-full max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden">
        {/* Left side - Image */}
        <div className="w-1/2 bg-gray-900 p-8">
          <Image
            src={forgotPasswordImg}
            alt="Forgot Password"
            className="h-full w-auto"
            width={600}
            height={400}
            priority
          />
        </div>

        {/* Right side - Form */}
        <div className="w-1/2 bg-gray-800 p-12 flex flex-col justify-center">
          <h2 className="text-white text-3xl font-bold mb-4">
            Forgot Password ?
          </h2>
          <p className="text-gray-400 mb-6">Please enter your email</p>
          <div className="mb-4">
            <Label htmlFor="email" className="text-gray-400">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="example@mail.com"
              className="mt-2 bg-gray-700 text-white"
            />
          </div>
          <Button className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
