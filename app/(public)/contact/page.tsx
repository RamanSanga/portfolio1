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
    <section className="mx-auto w-full max-w-4xl px-6 py-14 md:py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">Contact</h1>
      <p className="mt-3 text-zinc-400">{ctaDescription}</p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <a href={`mailto:${profile?.primaryEmail ?? ""}`} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Primary Email</p>
          <p className="mt-2 text-sm text-zinc-100">{profile?.primaryEmail}</p>
        </a>
        <a href={`mailto:${profile?.universityEmail ?? ""}`} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">University Email</p>
          <p className="mt-2 text-sm text-zinc-100">{profile?.universityEmail}</p>
        </a>
      </div>

      <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-xl font-semibold text-zinc-100">{ctaTitle}</h2>
        <p className="mt-2 text-sm text-zinc-400">Share project details, role scope, and timelines for faster response.</p>
        <div className="mt-6">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
