"use client";

import { useState, useTransition } from "react";

type UploadResult = {
  secure_url?: string;
  public_id?: string;
  resource_type?: string;
  original_filename?: string;
};

type SignaturePayload = {
  timestamp: number;
  signature: string;
  folder: string;
  cloudName: string;
  apiKey: string;
};

export function MediaUploader() {
  const [folder, setFolder] = useState("portfolio-cms");
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onFileChange = (file: File | null) => {
    if (!file) return;

    setResult(null);
    setError(null);

    startTransition(async () => {
      try {
        const signatureRes = await fetch("/api/upload/signature", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder }),
        });

        if (!signatureRes.ok) {
          setError("Unable to generate upload signature.");
          return;
        }

        const signatureData = (await signatureRes.json()) as SignaturePayload;

        const uploadForm = new FormData();
        uploadForm.append("file", file);
        uploadForm.append("api_key", signatureData.apiKey);
        uploadForm.append("timestamp", String(signatureData.timestamp));
        uploadForm.append("signature", signatureData.signature);
        uploadForm.append("folder", signatureData.folder);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/auto/upload`,
          {
            method: "POST",
            body: uploadForm,
          },
        );

        if (!uploadRes.ok) {
          setError("Cloudinary upload failed.");
          return;
        }

        const uploadData = (await uploadRes.json()) as UploadResult;
        setResult(uploadData);
      } catch {
        setError("Upload failed. Please retry.");
      }
    });
  };

  return (
    <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-zinc-500">Upload Folder</label>
        <input
          value={folder}
          onChange={(event) => setFolder(event.target.value)}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          placeholder="portfolio-cms/projects"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-zinc-500">Select File</label>
        <input
          type="file"
          onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
          className="block w-full text-sm text-zinc-300"
        />
      </div>

      {isPending ? <p className="text-sm text-zinc-400">Uploading...</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {result?.secure_url ? (
        <div className="space-y-2 rounded-md border border-zinc-700 bg-zinc-950 p-3">
          <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">Upload Result</p>
          <p className="text-xs text-zinc-300 break-all">URL: {result.secure_url}</p>
          <p className="text-xs text-zinc-300 break-all">Public ID: {result.public_id}</p>
        </div>
      ) : null}
    </div>
  );
}
