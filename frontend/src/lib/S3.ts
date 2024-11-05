import { userInstance } from "@/axios";
import axios from "axios";

interface Response {
  success: boolean;
  message: string;
}

export const getUploadUrl = async () => {
  try {
    const response = await userInstance.get("users/upload/image");

    return response.data as Response & { uploadUrl: string; avatarUrl: string };
  } catch (error) {
    throw error;
  }
};

export const uploadFileToS3 = async (
  presignedUrl: string,
  file: File
): Promise<void> => {
  try {
    const options = {
      headers: {
        "Content-Type": file.type,
      },
    };
    console.log("Uploading file:", file.name, "Size:", file.size);

    await axios.put(presignedUrl, file, options);

    console.log("File uploaded successfully");
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};
