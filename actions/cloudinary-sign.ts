"use server";

import { requireAdminSession } from "@/lib/authz";
import { cloudinary } from "@/lib/cloudinary";

export async function getCloudinarySignatureAction() {
  await requireAdminSession();

  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      folder: "portfolio/projects",
    },
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder: "portfolio/projects",
  };
}
