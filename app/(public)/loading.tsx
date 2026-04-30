export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center" style={{ minHeight: "50vh", width: "100%" }}>
      <div className="flex flex-col items-center animate-fade-up">
        {/* Animated loader */}
        <div style={{ position: "relative", width: "40px", height: "40px", marginBottom: "1.5rem" }}>
          <div style={{ position: "absolute", inset: 0, border: "2px solid rgba(255,255,255,0.1)", borderRadius: "50%" }} />
          <div 
            style={{ 
              position: "absolute", 
              inset: 0, 
              border: "2px solid transparent", 
              borderTopColor: "var(--foreground)", 
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} 
          />
        </div>
        <p style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-tertiary)", fontWeight: 600 }}>
          Loading
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
