import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach out for roles, freelance work, and product collaborations.",
};

export default async function ContactPage() {
  const [profile, settings] = await Promise.all([
    prisma.siteProfile.findFirst({ where: { singletonKey: "main" } }),
    prisma.siteSetting.findMany({
      where: {
        key: {
          in: ["contact_cta_title", "contact_cta_description"],
        },
      },
    }),
  ]);

  const settingsMap = new Map(settings.map((item) => [item.key, item.value]));
  const ctaTitle = String(settingsMap.get("contact_cta_title") ?? "Let us build your next product.");
  const ctaDescription = String(
    settingsMap.get("contact_cta_description") ??
      "Open to meaningful engineering opportunities and product collaboration.",
  );

  return (
    <section className="premium-container w-full section-shell pt-24 sm:pt-28 md:pt-32">
      <div className="page-hero animate-fade-up">
        <p className="page-hero__eyebrow">Get in touch</p>
        <h1 className="page-hero__title">Contact</h1>
        <p className="page-hero__copy">{ctaDescription}</p>
      </div>

      <div className="mx-auto grid max-w-7xl gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
        
        {/* Contact form */}
        <div className="page-panel animate-fade-up delay-100 p-6 sm:p-8 lg:p-10">
          <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em] text-foreground sm:text-[1.5rem]">
            {ctaTitle}
          </h2>
          <p className="mb-8 text-[0.95rem] text-(--text-tertiary)">
            Share project details, role scope, and timelines for a faster response.
          </p>
          <ContactForm />
        </div>

        {/* Direct contact cards */}
        <div className="animate-fade-up delay-200 flex flex-col gap-4 sm:gap-5">
          <p className="mb-1 text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-(--text-quaternary)">
            Direct Contact
          </p>
          
          {profile?.primaryEmail && (
            <a
              href={`mailto:${profile.primaryEmail}`}
              className="card group flex flex-col p-5 bg-white/5 sm:p-6"
            >
              <div className="mb-2 flex items-center justify-between gap-4">
                <p className="text-[0.8rem] font-medium text-(--text-tertiary)">Primary Email</p>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-foreground transition-colors">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>
              <p className="break-all text-[0.98rem] font-medium text-foreground sm:text-[1.06rem]">
                {profile.primaryEmail}
              </p>
            </a>
          )}
          
          {profile?.universityEmail && (
            <a
              href={`mailto:${profile.universityEmail}`}
              className="card group flex flex-col p-5 bg-white/5 sm:p-6"
            >
              <div className="mb-2 flex items-center justify-between gap-4">
                <p className="text-[0.8rem] font-medium text-(--text-tertiary)">University Email</p>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-foreground transition-colors">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>
              <p className="break-all text-[0.98rem] font-medium text-foreground sm:text-[1.06rem]">
                {profile.universityEmail}
              </p>
            </a>
          )}
        </div>
        
      </div>

    </section>
  );
}
