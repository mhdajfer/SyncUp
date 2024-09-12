import { userInstance } from "@/axios";

export const login = async (formData: {
  username: string;
  password: string;
}) => {
  try {
    const response = await userInstance.post("/login", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
