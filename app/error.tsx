"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <div className="animate-fade-up text-center flex flex-col items-center">
        <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, letterSpacing: "-0.03em", marginBottom: "1rem" }}>
          Unexpected Error
        </h2>
        <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", maxWidth: "450px", margin: "0 auto", marginBottom: "3rem", lineHeight: 1.6 }}>
          We encountered a problem while trying to load this section. The issue has been logged.
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => reset()} className="btn-primary" style={{ padding: "0.875rem 2rem", fontSize: "1rem", cursor: "pointer" }}>
            Try again
          </button>
          <Link href="/" className="btn-ghost" style={{ padding: "0.875rem 2rem", fontSize: "1rem" }}>
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
