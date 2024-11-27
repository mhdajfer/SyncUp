"use client";

import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { createPaymentIntent } from "@/api/payments/create-payment-intent";
import Loading from "../Loading-lazy/Loading";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateSubscription } from "@/api/userService/user";
import { useDispatch } from "react-redux";
import { updateUserDetails } from "@/store/slices/authSlice";

export function CheckoutForm() {
  const stripe = useStripe();
  const dispatch = useDispatch();
  const router = useRouter();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const response = await createPaymentIntent(1000, "USD");
      const clientSecret = response.data;
      const totalPriceString = localStorage.getItem("total-price");

      const totalPrice = totalPriceString ? parseFloat(totalPriceString) : 0;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setMessage(result.error.message || "Payment failed.");
        toast.error(result.error.message || "Payment failed.");
      } else if (
        result.paymentIntent &&
        result.paymentIntent.status === "succeeded"
      ) {
        setMessage("Payment succeeded!");
        toast.success("subscription activated!");
        const updateResponse = await updateSubscription(totalPrice);

        if (updateResponse.success) {
          dispatch(updateUserDetails(updateResponse.data));
          toast.success("Subscription updated!");
        }
        router.back();
      }
    } catch (error) {
      console.error("Payment failed:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
          <CardDescription>
            Enter your card details to process the payment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <label
                htmlFor="card-element"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Card Details
              </label>
              <div className="h-11 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background">
                <CardElement
                  id="card-element"
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-2">
          <Button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full"
          >
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
