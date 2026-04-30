import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/forms/project-form";
import { prisma } from "@/lib/prisma";

type AdminProjectEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProjectEditPage({ params }: AdminProjectEditPageProps) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Edit Project</h1>
          <p className="mt-1 text-sm text-zinc-400">Update content, status, and metadata for this project.</p>
        </div>
        <Link
          href="/admin/projects"
          className="rounded-md border border-zinc-700 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-300"
        >
          Back to Projects
        </Link>
      </div>

      <ProjectForm
        mode="edit"
        projectId={project.id}
        initialValues={{
          title: project.title,
          slug: project.slug,
          shortDescription: project.shortDescription,
          longDescription: project.longDescription ?? "",
          problem: project.problem ?? "",
          solution: project.solution ?? "",
          impact: project.impact ?? "",
          techStackText: Array.isArray(project.techStack) ? project.techStack.join(", ") : "",
          liveUrl: project.liveUrl ?? "",
          repoUrl: project.repoUrl ?? "",
          caseStudyUrl: project.caseStudyUrl ?? "",
          coverImageUrl: project.coverImageUrl ?? "",
          videoUrl: project.videoUrl ?? "",
          sortOrder: project.sortOrder,
          featured: project.featured,
          published: project.published,
        }}
      />
    </div>
  );
}
