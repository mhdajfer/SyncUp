import { userInstance } from "@/axios";
import { UserDetails } from "@/Components/Forms/ProjectForm";
import { ICreateTenant, ITenant, User } from "@/interfaces/User";
import Cookies from "js-cookie";

interface Response {
  success: boolean;
  message: string;
  data: User[] | User | null | ITenant;
}

export const login = async (formData: {
  username: string;
  password: string;
}) => {
  try {
    const response = await userInstance.post("users/login", formData);
    console.log(response);

    return response.data as {
      success: boolean;
      user: User;
      accessToken: string;
      refreshToken: string;
    };
  } catch (error) {
    throw error;
  }
};

export const getProjectManagers = async () => {
  try {
    const response = await userInstance.get("/users/pmanagers");

    return response.data as { success: boolean; data: UserDetails[] };
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

export const createUser = async ({
  userData,
}: {
  userData: User;
}): Promise<{ success: boolean; data: User; message: string }> => {
  try {
    console.log(userData);

    const response = await userInstance.post("/users", userData);

    return response.data as { success: boolean; data: User; message: string };
  } catch (error) {
    throw error;
  }
};

export const blockUser = async (
  userId: string
): Promise<{ success: boolean; data: User; message: string }> => {
  try {
    const response = await userInstance.post("/users/block", { userId });

    return response.data as Promise<{
      success: boolean;
      data: User;
      message: string;
    }>;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (
  userId: string
): Promise<{ success: boolean; data: User; message: string }> => {
  try {
    const response = await userInstance.post("/users/delete", { userId });

    return response.data as Promise<{
      success: boolean;
      data: User;
      message: string;
    }>;
  } catch (error) {
    throw error;
  }
};

export const verifyRefreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    console.log(refreshToken);

    userInstance.defaults.headers.common["Authorization"] = refreshToken;
    const response: {
      data: { success: boolean; data: null; newAccessToken: string };
    } = await userInstance.post("/users/verify", { refreshToken });

    Cookies.set("accessToken", response.data.newAccessToken);
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await userInstance.get("/users");

    return response.data as { success: boolean; data: User[]; message: string };
  } catch (error) {
    throw error;
  }
};

export const createTenant = async (tenantData: ICreateTenant) => {
  try {
    console.log("form data: ", tenantData);
    const response = await userInstance.post("/tenants", tenantData);

    return response.data as Response;
  } catch (error) {
    throw error;
  }
};

export const setPasswordAndCreateUser = async (
  token: string,
  password: string
) => {
  try {
    const response = await userInstance.post("/users/setup-password", {
      token,
      password,
    });

    return response.data as Response;
  } catch (error) {
    throw error;
  }
};

export const inviteUser = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
}) => {
  try {
    const response = await userInstance.post("/users/invite", data);

    return response.data as Response;
  } catch (error) {
    throw error;
  }
};
