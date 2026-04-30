"use server";

import { requireAdminSession } from "@/lib/authz";
import { cloudinary } from "@/lib/cloudinary";

export async function uploadMediaAction(formData: FormData) {
  await requireAdminSession();

  const file = formData.get("file") as File;
  if (!file) {
    console.log("Upload Action Error: No file found");
    throw new Error("No file provided");
  }

  console.log(`Upload Action: Processing ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "portfolio/projects",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return reject(new Error(error.message || "Upload failed"));
        }
        if (!result) {
          return reject(new Error("No result from Cloudinary"));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
}
