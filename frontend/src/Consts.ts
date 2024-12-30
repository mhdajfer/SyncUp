export const BASIC_URL = process.env.NEXT_PUBLIC_BASIC_URL;

export const S3_URL =
  process.env.NEXT_PUBLIC_S3_URL ||
  "https://syncupcloud.s3.eu-north-1.amazonaws.com";

export const TASK_CATEGORY = ["Feature", "Bug", "Testing", "Planning"];

export const fileTypeExtensionMap: { [key: string]: string } = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "application/pdf": ".pdf",
  "text/plain": ".txt",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
};
