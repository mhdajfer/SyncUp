import { userInstance } from "@/axios";
import { User } from "@/interfaces/User";

export const login = async (formData: {
  username: string;
  password: string;
}) => {
  try {
    const response = await userInstance.post("users/login", formData);

    return response.data as {
      success: boolean;
      user: User;
      accessToken: string;
    };
  } catch (error) {
    throw error;
  }
};

export const getProjectManagers = async () => {
  try {
    const response = await userInstance.get("/users/pmanagers");

    return response.data as { success: boolean; data: User[] };
  } catch (error) {
    throw error;
  }
};

export const getDevelopers = async () => {
  try {
    const response = await userInstance.get("/users/developers");

    return response.data as { success: boolean; data: User[] };
  } catch (error) {
    throw error;
  }
};
