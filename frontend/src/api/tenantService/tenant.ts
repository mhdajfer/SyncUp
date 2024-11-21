import { userInstance } from "@/axios";
import { ITenant } from "@/interfaces/User";

interface Response {
  success: boolean;
  message: string;
  data: ITenant;
}

export const getTenantDetails = async () => {
  try {
    const response = await userInstance.get("/tenants");

    return response.data as Response;
  } catch (error) {
    throw error;
  }
};

export const editTenantDetails = async (tenantData: ITenant) => {
  try {
    const response = await userInstance.put("/tenants", { tenantData });

    return response.data as Response;
  } catch (error) {
    throw error;
  }
};

export const getAllTenants = async () => {
  try {
    const response = await userInstance.get("/tenants/all");

    return response.data as Response & { data: ITenant[] };
  } catch (error) {
    throw error;
  }
};
