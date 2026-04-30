import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <div className="animate-fade-up text-center flex flex-col items-center">
        <h1 style={{ fontSize: "clamp(6rem, 15vw, 12rem)", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1, color: "var(--text-tertiary)", opacity: 0.2 }}>
          404
        </h1>
        <div style={{ marginTop: "-2rem" }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            Page not found
          </h2>
          <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", maxWidth: "400px", margin: "0 auto", marginBottom: "3rem", lineHeight: 1.6 }}>
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link href="/" className="btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1rem" }}>
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
