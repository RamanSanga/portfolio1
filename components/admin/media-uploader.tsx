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
    <div
      className="admin-section"
      style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}
    >
      <div>
        <label className="admin-field-label">Upload Folder</label>
        <input
          value={folder}
          onChange={(event) => setFolder(event.target.value)}
          className="admin-input"
          placeholder="portfolio-cms/projects"
        />
      </div>

      <div>
        <label className="admin-field-label">Select File</label>
        <div
          style={{
            borderRadius: "8px",
            border: "1px dashed var(--border-strong)",
            padding: "1.25rem",
            textAlign: "center",
            background: "var(--background)",
          }}
        >
          <input
            type="file"
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
            style={{
              fontSize: "0.8125rem",
              color: "var(--text-secondary)",
              width: "100%",
              cursor: "pointer",
            }}
          />
          <p style={{ fontSize: "0.75rem", color: "var(--text-quaternary)", marginTop: "0.5rem" }}>
            Images, PDFs, and other assets — max 10 MB
          </p>
        </div>
      </div>

      {isPending && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            padding: "0.625rem 0.875rem",
            borderRadius: "6px",
            background: "var(--info-muted)",
            border: "1px solid rgba(96,165,250,0.2)",
            fontSize: "0.8125rem",
            color: "#93c5fd",
          }}
        >
          <span style={{ animation: "pulse 1.5s ease-in-out infinite" }}>⬆</span>
          Uploading to Cloudinary…
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "0.625rem 0.875rem",
            borderRadius: "6px",
            background: "var(--danger-muted)",
            border: "1px solid rgba(239,68,68,0.25)",
            fontSize: "0.8125rem",
            color: "#fca5a5",
          }}
        >
          {error}
        </div>
      )}

      {result?.secure_url && (
        <div
          style={{
            padding: "1rem",
            borderRadius: "8px",
            background: "var(--success-muted)",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          <p
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#86efac",
              marginBottom: "0.75rem",
            }}
          >
            ✓ Upload Successful
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div>
              <p style={{ fontSize: "0.6875rem", color: "var(--text-quaternary)", marginBottom: "0.25rem" }}>URL</p>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--text-secondary)",
                  wordBreak: "break-all",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {result.secure_url}
              </p>
            </div>
            <div>
              <p style={{ fontSize: "0.6875rem", color: "var(--text-quaternary)", marginBottom: "0.25rem" }}>Public ID</p>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--text-secondary)",
                  wordBreak: "break-all",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {result.public_id}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
