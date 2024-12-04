"use client";

import React, { useState } from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";

export function FileUpload({
  onFileChange,
  accept,
  maxSize,
  className = "",
  error,
}: {
  onFileChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
  error?: string | null;
}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (maxSize && file.size > maxSize) {
        setFileError(`File size exceeds ${maxSize / 1000000}MB limit.`);
        setFileName(null);
        onFileChange(null);
      } else {
        setFileName(file.name);
        setFileError(null);
        onFileChange(file);
      }
    } else {
      setFileName(null);
      setFileError(null);
      onFileChange(null);
    }
  };

  const clearFile = () => {
    setFileName(null);
    setFileError(null);
    onFileChange(null);
    if (
      document.getElementById("cool-file-upload") instanceof HTMLInputElement
    ) {
      (document.getElementById("cool-file-upload") as HTMLInputElement).value =
        "";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label htmlFor="cool-file-upload" className="text-lg font-semibold">
        {"Upload Document"}
      </Label>
      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 transition-all duration-300 ease-in-out hover:border-primary">
        <input
          id="cool-file-upload"
          type="file"
          className="hidden"
          onChange={handleChange}
          accept={accept}
        />
        <div className="flex flex-col items-center justify-center space-y-4">
          {fileName ? (
            <div className="flex items-center space-x-2">
              <File className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">{fileName}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearFile}
                className="rounded-full p-1 hover:bg-red-100"
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400" />
              <p className="text-sm text-gray-500">
                Drag and drop your file here, or
              </p>
            </>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("cool-file-upload")?.click()}
            className="mt-2"
          >
            {fileName ? "Change File" : "Select File"}
          </Button>
        </div>
      </div>
      {(fileError || error) && (
        <p className="text-red-700 text-sm mt-2 bg-red-100 bg-opacity-70 py-2 px-3 rounded-md">
          {fileError || error}
        </p>
      )}
    </div>
  );
}
