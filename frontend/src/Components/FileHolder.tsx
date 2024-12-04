"use client";

import { useState } from "react";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { toast } from "sonner";
import { FileIcon, Loader2, ExternalLink } from "lucide-react";

interface FileHolderProps {
  file: {
    name: string;
    type: string;
    size: number;
    url: string;
  };
}

export default function FileHolder({ file }: FileHolderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const s3Url = process.env.NEXT_PUBLIC_S3_URL;

  if (!s3Url) {
    toast.error("S3 URL not specified");
    return null;
  }

  const handleViewFile = async () => {
    setIsLoading(true);
    try {
      const fileUrl = `${s3Url}/${file.url}`;
      window.open(fileUrl, "_blank");
    } catch (error) {
      console.error("Error fetching file:", error);
      toast.error("Failed to open file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-gray-900 text-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 border-gray-800">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="flex items-center space-x-2">
          <FileIcon className="w-6 h-6 text-blue-400" />
          <span className="truncate">{file.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-gray-400">Type: {file.type}</p>
        <p className="text-sm text-gray-400">
          Size: {(file.size / 1024).toFixed(2)} KB
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleViewFile}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ExternalLink className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Opening..." : "View File in New Tab"}
        </Button>
      </CardFooter>
    </Card>
  );
}
