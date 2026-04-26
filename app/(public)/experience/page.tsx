import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Experience",
  description: "Professional delivery experience and engineering achievements.",
};

export default async function ExperiencePage() {
  const experience = await prisma.experience.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { startDate: "desc" }],
  });

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-14 md:py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">Experience</h1>
      <div className="mt-10 space-y-4">
        {experience.map((item) => (
          <article key={item.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-lg font-medium text-zinc-100">
              {item.role} · {item.organization}
            </h2>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-zinc-500">{item.context}</p>
            <p className="mt-4 text-sm leading-7 text-zinc-400">{item.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
