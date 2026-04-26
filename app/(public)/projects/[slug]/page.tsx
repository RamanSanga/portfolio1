import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedProjectBySlug } from "@/lib/queries/public";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      type: "article",
      images: project.coverImageUrl ? [project.coverImageUrl] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const techStack = Array.isArray(project.techStack) ? (project.techStack as string[]) : [];

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-14 md:py-20">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Case Study</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">{project.title}</h1>
      <p className="mt-4 text-base leading-7 text-zinc-300">{project.shortDescription}</p>

      {project.longDescription ? (
        <p className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-sm leading-7 text-zinc-400">
          {project.longDescription}
        </p>
      ) : null}

      {techStack.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-zinc-400">Tech Stack</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-300">{techStack.join(" • ")}</p>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900"
          >
            Live Project
          </a>
        ) : null}
        {project.repoUrl ? (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-100"
          >
            Source Code
          </a>
        ) : null}
      </div>
    </section>
  );
}
