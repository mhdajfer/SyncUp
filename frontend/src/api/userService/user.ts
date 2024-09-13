import { userInstance } from "@/axios";
import { User } from "@/interfaces/User";

export const login = async (formData: {
  username: string;
  password: string;
}) => {
  try {
    const response = await userInstance.post("/login", formData);

    return response.data as {
      success: boolean;
      user: User;
      accessToken: string;
    };
  } catch (error) {
    throw error;
  }
};
