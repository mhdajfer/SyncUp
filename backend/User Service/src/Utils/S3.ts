import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { configDotenv } from "dotenv";

configDotenv();

export const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const getUploadSignedUrl = async (
  key: string,
  contentType: string
): Promise<string | null> => {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return signedUrl;
  } catch (error) {
    console.log("Error while retrieving signed url", error);
    return null;
  }
};
export const deleteAvatarIfExists = async (avatarUrl?: string) => {
  if (!avatarUrl) return;

  // Extract the S3 key from the URL
  const key = avatarUrl.split(".com/")[1];
  if (!key) return;

  const deleteCommand = new DeleteObjectCommand({
    Bucket: "your-bucket-name",
    Key: key,
  });

  try {
    await s3Client.send(deleteCommand);
    console.log(`Deleted old avatar: ${key}`);
  } catch (error) {
    console.error("Error deleting old avatar:", error);
  }
};
