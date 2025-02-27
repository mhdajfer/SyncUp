"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "@/Components/Forms/CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51QOxa7JZQtcfGAZqWF7l0Bm4rh7TgbZhXX3bS5s2DzpadDiDP1t7wyCH8zweL79NsN0GdYmYka60Knp04AaGnjR7008PsDGqfg"
);
export default function CheckoutPage() {

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
