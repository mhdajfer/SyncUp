import { userInstance } from "@/axios";
import { ITenant, User } from "@/interfaces/User";

interface Response {
  success: boolean;
  message: string;
  data: User[] | User | null | ITenant;
}

export const getTenantDetails = async () => {
  try {
    const response = await userInstance.get("/tenants");

    return response.data as Response;
  } catch (error) {
    throw error;
  }
};
