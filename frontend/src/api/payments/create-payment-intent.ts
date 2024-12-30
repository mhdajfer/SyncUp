import { userInstance } from "@/axios";

export const createPaymentIntent = async (amount: number, currency: string) => {
  try {

    const response = await userInstance.post(`/users/create-intent`, {
      amount,
      currency,
    });

    return response.data as { success: true; data: string; message: string };
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    throw error;
  }
};
