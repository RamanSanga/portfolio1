import Link from "next/link";
import {
  deleteProjectAction,
  toggleProjectFeaturedAction,
  toggleProjectPublishedAction,
} from "@/actions/projects";
import { prisma } from "@/lib/prisma";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Projects</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage case studies, publication status, and featured order.</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white"
        >
          New Project
        </Link>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <article key={project.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-medium text-zinc-100">{project.title}</h2>
                  <span className="rounded border border-zinc-700 px-2 py-0.5 text-[11px] uppercase tracking-[0.12em] text-zinc-400">
                    {project.published ? "Published" : "Draft"}
                  </span>
                  {project.featured ? (
                    <span className="rounded border border-zinc-700 px-2 py-0.5 text-[11px] uppercase tracking-[0.12em] text-zinc-300">
                      Featured
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-zinc-400">/{project.slug}</p>
                <p className="mt-3 max-w-3xl text-sm text-zinc-400">{project.shortDescription}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className="rounded-md border border-zinc-700 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-300 transition hover:border-zinc-500"
                >
                  Edit
                </Link>
                <form action={toggleProjectFeaturedAction.bind(null, project.id)}>
                  <button
                    type="submit"
                    className="rounded-md border border-zinc-700 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-300 transition hover:border-zinc-500"
                  >
                    {project.featured ? "Unfeature" : "Feature"}
                  </button>
                </form>
                <form action={toggleProjectPublishedAction.bind(null, project.id)}>
                  <button
                    type="submit"
                    className="rounded-md border border-zinc-700 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-300 transition hover:border-zinc-500"
                  >
                    {project.published ? "Unpublish" : "Publish"}
                  </button>
                </form>
                <form action={deleteProjectAction.bind(null, project.id)}>
                  <button
                    type="submit"
                    className="rounded-md border border-red-900/70 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-red-300 transition hover:border-red-700"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
