import Link from "next/link";
import { getPublishedProjects } from "@/lib/queries/public";

export const metadata = {
  title: "Projects",
  description: "Selected product and engineering work.",
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-14 md:py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">Projects</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">
        Work emphasizing architecture clarity, delivery quality, and user-facing impact.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-zinc-700"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-medium text-zinc-100">{project.title}</h2>
              {project.featured ? (
                <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs uppercase tracking-[0.12em] text-zinc-400">
                  Featured
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{project.shortDescription}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
