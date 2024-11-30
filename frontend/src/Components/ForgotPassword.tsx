"use client";

import Image from "next/image";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import forgotPasswordImg from "../../public/12953573_Data_security_05-removebg-preview 1.png";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { verifyAndSendOtp } from "@/api/userService/user";
import { LockKeyhole } from "lucide-react";

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await verifyAndSendOtp(data.email);

      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("something went wrong!");
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-black/30 backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.15)] animate-fade-in-up">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 p-8 flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-transparent">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <Image
                src={forgotPasswordImg}
                alt="Forgot Password"
                className="relative transform transition-transform duration-500 hover:scale-105"
                width={500}
                height={400}
                priority
              />
            </div>
          </div>

          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <LockKeyhole className="h-6 w-6 text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Forgot Password?
              </h2>
            </div>

            <p className="text-gray-400 mb-8">
              {` Don't worry! It happens. Please enter your email address and we'll send you an OTP.`}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  className="bg-white/5 border-purple-500/20 focus:border-purple-500 text-white placeholder:text-gray-500 transition-all duration-300"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1 animate-shake">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2.5 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
