"use client";

import { useEffect, useState, useRef } from "react";

interface HeroBackgroundProps {
  projectTitles: string[];
  skills: string[];
}

export function HeroBackground({ projectTitles = [], skills = [] }: HeroBackgroundProps) {
  const [isMounted, setIsMounted] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const metadataRef1 = useRef<HTMLDivElement>(null);
  const metadataRef2 = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === "undefined" || "ontouchstart" in window) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        const { clientX: x, clientY: y } = e;
        
        if (spotlightRef.current) {
          spotlightRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(255, 255, 255, 0.08), transparent 40%)`;
        }
        
        if (gridRef.current) {
          gridRef.current.style.backgroundPosition = `${x / 40}px ${y / 40}px`;
        }

        if (metadataRef1.current) {
          metadataRef1.current.style.transform = `perspective(1000px) rotateX(${(y - 300) / 50}deg) rotateY(${(x - 1200) / -50}deg)`;
        }

        if (metadataRef2.current) {
          metadataRef2.current.style.transform = `perspective(1000px) rotateX(${(y - 700) / 50}deg) rotateY(${(x - 1200) / -50}deg)`;
        }

        rafRef.current = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050608]">
      <div className="absolute inset-0 z-0 hidden flex-col justify-center gap-6 md:flex md:gap-10 opacity-[0.08] select-none pointer-events-none">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="text-[5vh] md:text-[10vh] font-black uppercase tracking-tighter px-3 md:px-6">
              {projectTitles.join(" • ")} •
            </span>
          ))}
        </div>
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="text-[5vh] md:text-[10vh] font-black uppercase tracking-tighter px-3 md:px-6">
              {skills.join(" • ")} •
            </span>
          ))}
        </div>
      </div>

      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 z-10 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at 50% 50%, rgba(255, 255, 255, 0.08), transparent 40%)`,
          willChange: "background",
        }}
      />

      <div className="absolute inset-0 z-20 pointer-events-none">
        <div
          ref={metadataRef1}
          className="absolute right-[8%] top-[18%] hidden lg:flex flex-col items-end gap-2 animate-float bg-white/3 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl transition-transform duration-300"
          style={{ willChange: "transform" }}
        >
          <span className="text-[10px] font-mono text-white/60 uppercase tracking-[0.4em] animate-pulse-soft">Portfolio_Index</span>
          <div className="h-px w-32 bg-linear-to-l from-white/40 to-transparent" />
          <span className="text-3xl font-bold text-white tracking-tight tabular-nums">
            {projectTitles.length < 5 ? "Signature_Works" : `${projectTitles.length}+ Productions`}
          </span>
        </div>

        <div
          ref={metadataRef2}
          className="absolute right-[8%] bottom-[15%] hidden xl:flex flex-col items-end gap-4 animate-float bg-white/3 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl transition-transform duration-300"
          style={{ willChange: "transform" }}
        >
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[10px] font-mono text-white/60 uppercase tracking-[0.4em] animate-pulse-soft">Technical_Stack</span>
            <div className="h-px w-40 bg-linear-to-l from-white/40 to-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-right">
            {skills.slice(0, 8).map((skill) => (
              <div key={skill} className="flex items-center justify-end gap-2.5 text-right">
                <span className="text-[12px] font-semibold text-white/70 tracking-wide">{skill}</span>
                <div className="h-1.5 w-1.5 rounded-full bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={gridRef}
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: "120px 120px",
          willChange: "background-position",
        }}
      />

      <div className="absolute inset-0 z-30 pointer-events-none bg-linear-to-b from-[#050608] via-transparent to-[#050608]" />
      
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
