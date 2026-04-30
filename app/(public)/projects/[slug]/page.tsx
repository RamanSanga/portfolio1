import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
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
    <article className="bg-background w-full pb-24">
      
      {/* Premium Hero Section */}
      <div className="relative flex h-[60dvh] min-h-[320px] max-h-[800px] w-full items-end overflow-hidden sm:h-[65dvh]">
        
        {/* Background Video or Image or Abstract Gradient */}
        {project.videoUrl && !project.videoUrl.includes("loom.com") ? (
          <video
            src={project.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : project.coverImageUrl ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${project.coverImageUrl})` }} />
        ) : (
          <div className="bg-gradient-animated absolute inset-0" />
        )}
        
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="premium-container relative z-10 w-full pb-[clamp(3rem,8vw,6rem)]">
           <Link
            href="/projects"
            className="mb-8 inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-[0.8rem] font-medium text-(--text-secondary) backdrop-blur-md transition-all hover:bg-white/10 sm:mb-12"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Projects
          </Link>

          <p className="animate-fade-up delay-100 mb-4 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-white/40 sm:mb-6">
            Project Index / {project.featured ? "Featured" : "Selected"}
          </p>
          <h1 className="animate-fade-up delay-200 max-w-5xl text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-tight text-white">
            {project.title}
          </h1>
        </div>
      </div>

      <div className="premium-container mt-12 sm:mt-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16 items-start">
          
          {/* Main Content Column */}
          <div className="animate-fade-up delay-300">
            <h2 className="mb-6 text-[1.2rem] font-medium leading-normal tracking-[-0.01em] text-foreground sm:text-[1.5rem]">
              {project.shortDescription}
            </h2>
            
            {project.longDescription ? (
              <div className="flex flex-col gap-6 text-[1rem] leading-8 text-(--text-secondary) sm:text-[1.0625rem]">
                <p>{project.longDescription}</p>
              </div>
            ) : null}
          </div>

          {/* Metadata / Sidebar Column */}
          <div className="animate-fade-up delay-300 flex flex-col gap-10 lg:sticky lg:top-30 lg:gap-12">
            
            {/* Tech stack */}
            {techStack.length > 0 ? (
              <div>
                <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-(--text-quaternary)">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-(--border-subtle) bg-surface px-3 py-1.5 text-[0.8rem] font-medium text-(--text-secondary)"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Links */}
            {(project.liveUrl || project.repoUrl) && (
              <div>
                <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-(--text-quaternary)">Links</p>
                <div className="flex flex-col gap-4">
                  {project.liveUrl ? (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary w-full">
                      View Live Project
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  ) : null}
                  {project.repoUrl ? (
                    <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn-ghost w-full">
                      View Source Code
                    </a>
                  ) : null}
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>

    </article>
  );
}
