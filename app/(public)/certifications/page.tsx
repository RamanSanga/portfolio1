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
    <section className="mx-auto w-full max-w-4xl px-6 py-14 md:py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">Certifications</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {certifications.map((item) => (
          <article key={item.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{item.issuer}</p>
            <h2 className="mt-2 text-base font-medium text-zinc-100">{item.title}</h2>
          </article>
        ))}
      </div>
    </section>
  );
}
