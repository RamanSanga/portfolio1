import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Certifications",
  description: "Technical certifications and validated learning milestones.",
};

export default async function CertificationsPage() {
  const certifications = await prisma.certification.findMany({
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <section className="premium-container w-full section-shell">
      <div className="page-hero animate-fade-up">
        <p className="page-hero__eyebrow">Continuous Learning</p>
        <h1 className="page-hero__title">Certifications</h1>
        <p className="page-hero__copy">
          Technical credentials and validated milestones across core engineering domains.
        </p>
      </div>

      <div className="page-card-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {certifications.map((item, index) => (
          <article
            key={item.id}
            className={`page-panel group animate-fade-up delay-${Math.min((index + 1) * 100, 500)} p-8 flex min-h-[180px] flex-col justify-center`}
          >
            <div className="absolute left-0 top-0 h-[2px] w-full translate-x-[-100%] bg-[linear-gradient(90deg,transparent,var(--border-focus),transparent)] transition-transform duration-500 group-hover:translate-x-0" />

            <div className="page-panel__header">
              <div className="page-panel__icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15l-2 5l9-9l-9-9l2 5l-10 4z" />
                </svg>
              </div>
              <p className="page-panel__label">{item.issuer}</p>
            </div>
            
            <h2 className="page-panel__title">
              {item.title}
            </h2>
          </article>
        ))}
      </div>

    </section>
  );
}
