/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import Loading from "../Loading-lazy/Loading";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateSubscription } from "@/api/userService/user";
import { useDispatch } from "react-redux";
import { updateUserDetails } from "@/store/slices/authSlice";
import { Button } from "../ui/button";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export function CheckoutForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const totalPriceString = localStorage.getItem("total-price");
      const totalPrice = totalPriceString ? parseFloat(totalPriceString) : 0;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalPrice * 100, // amount in paisa
        currency: "INR",
        name: "SyncUp",
        description: "Subscription Payment",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const updateResponse = await updateSubscription(totalPrice);
            if (updateResponse.success) {
              dispatch(updateUserDetails(updateResponse.data));
              setMessage("Payment succeeded!");
              toast.success("Subscription activated!");
              router.back();
            }
          } catch (error) {
            console.error("Verification failed:", error);
            setMessage("Payment verification failed");
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          email: "user@example.com",
        },
        theme: {
          color: "#6366f1",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment failed:", error);
      setMessage("Something went wrong. Please try again.");
      toast.error("Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
          <CardDescription>
            Click below to proceed with secure payment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <p className="text-center text-sm text-gray-600">
              You will be redirected to Razorpay secure checkout
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-2">
          <Button type="submit" disabled={isProcessing} className="w-full">
            {isProcessing ? (
              <>
                <Loading />
                Processing...
              </>
            ) : (
              "Pay Now"
            )}
          </Button>
          {message && (
            <p
              className={`text-sm ${
                message.includes("succeeded")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}
