"use client";

import { useState, useRef } from "react";
import { getCloudinarySignatureAction } from "@/actions/cloudinary-sign";

interface MediaUploadProps {
  onUploadComplete: (url: string) => void;
  label: string;
}

export function MediaUpload({ onUploadComplete, label }: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // 1. Get signature from server
      const { signature, timestamp, cloudName, apiKey, folder } = await getCloudinarySignatureAction();

      // 2. Upload directly to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey!);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error.message);
      }

      onUploadComplete(result.secure_url);
    } catch (error: any) {
      console.error("Upload failed:", error);
      alert(`Upload failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</label>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`flex h-12 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-zinc-700 bg-zinc-900/50 transition-colors hover:border-zinc-500 ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <span className="text-sm text-zinc-400">
          {isUploading ? "Uploading..." : "Click to upload from Finder"}
        </span>
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          onChange={handleUpload}
          accept="image/*,video/*"
        />
      </div>
    </div>
  );
}
