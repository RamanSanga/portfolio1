"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
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
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#0a0a0a", color: "#f5f5f5", fontFamily: "var(--font-geist-sans), sans-serif" }}>
          <div className="text-center flex flex-col items-center">
            <h1 style={{ fontSize: "3rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "1rem" }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: "1.125rem", color: "#a3a3a3", maxWidth: "400px", margin: "0 auto", marginBottom: "2rem", lineHeight: 1.6 }}>
              A critical error occurred while rendering the application. We've been notified.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button 
                onClick={() => reset()} 
                style={{ 
                  background: "#f5f5f5", color: "#0a0a0a", padding: "0.875rem 2rem", 
                  borderRadius: "99px", fontWeight: 500, border: "none", cursor: "pointer" 
                }}
              >
                Try again
              </button>
              <button 
                onClick={() => window.location.href = "/"} 
                style={{ 
                  background: "transparent", color: "#f5f5f5", padding: "0.875rem 2rem", 
                  borderRadius: "99px", fontWeight: 500, border: "1px solid #333", cursor: "pointer" 
                }}
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
