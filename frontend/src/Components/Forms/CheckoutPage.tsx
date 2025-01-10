"use client";
import { CheckoutForm } from "@/Components/Forms/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
