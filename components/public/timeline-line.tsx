"use client";

import { useEffect, useRef, useState } from "react";

export function TimelineLine() {
  const [height, setHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the timeline is in/above the viewport
      const scrollPercentage = Math.max(0, Math.min(1, (windowHeight - top) / (windowHeight + height)));
      setHeight(scrollPercentage * 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="absolute left-[13px] sm:left-[17px] top-[10px] bottom-0 w-[1px] bg-white/10 overflow-hidden">
      <div 
        className="w-full bg-gradient-to-b from-white/40 via-white to-transparent transition-all duration-300 ease-out"
        style={{ height: `${height}%` }}
      />
    </div>
  );
}
