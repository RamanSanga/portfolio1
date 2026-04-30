import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { TimelineLine } from "@/components/public/timeline-line";

export const metadata: Metadata = {
  title: "Experience",
  description: "Professional delivery experience and engineering achievements.",
};

export default async function ExperiencePage() {
  const experience = await prisma.experience.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { startDate: "desc" }],
  });

  return (
    <section className="premium-container w-full section-shell">
      <div className="page-hero animate-fade-up">
        <p className="page-hero__eyebrow">Career</p>
        <h1 className="page-hero__title">Experience</h1>
        <p className="page-hero__copy">
          Professional delivery experience, engineering achievements, and technical leadership.
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-0">
        <div className="relative flex flex-col gap-16 md:gap-24">
          {/* Animated vertical connecting line */}
          <TimelineLine />

          {experience.map((item, index) => (
            <article
              key={item.id}
              className={`animate-fade-up delay-${Math.min((index + 1) * 100, 500)}`}
              style={{ position: "relative" }}
            >
              {/* Glowing Node */}
              <div className="absolute left-0 top-[12px] h-[28px] w-[28px] sm:h-[36px] sm:w-[36px] rounded-full border border-white/20 bg-background flex items-center justify-center z-10">
                <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </div>

              <div className="page-panel ml-10 sm:ml-16 p-6 sm:p-10">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-[1.375rem] font-semibold leading-[1.3] tracking-[-0.01em] text-[var(--foreground)]">
                      {item.role}
                    </h2>
                    <p className="mt-1.5 text-[1rem] text-[var(--text-secondary)]">
                      {item.organization}
                    </p>
                  </div>
                  <span className="badge badge-default shrink-0 bg-white/5 text-[var(--foreground)]">
                    {item.context}
                  </span>
                </div>
                
                <p className="border-t border-[var(--border-subtle)] pt-6 text-[0.9375rem] leading-7 text-[var(--text-tertiary)]">
                  {item.summary}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

    </section>
  );
}
