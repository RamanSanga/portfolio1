import Link from "next/link";
import { getPublishedProjects } from "@/lib/queries/public";

export const metadata = {
  title: "Projects",
  description: "Selected product and engineering work.",
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <section className="premium-container w-full section-shell pt-24 sm:pt-28 md:pt-32">
      <div className="page-hero animate-fade-up">
        <p className="page-hero__eyebrow">Work showcase</p>
        <h1 className="page-hero__title">Selected Projects</h1>
        <p className="page-hero__copy">Work emphasizing architecture clarity, delivery quality, and user-facing impact.</p>
      </div>

      <div className="flex flex-col gap-[clamp(2.5rem,6vw,8rem)]">
        {projects.map((project, index) => (
          <article key={project.id} className={`page-card glass-reflection-effect group animate-fade-up delay-${Math.min((index + 1) * 100, 500)} overflow-hidden`}>
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <Link
                href={project.liveUrl || `/projects/${project.slug}`}
                target={project.liveUrl ? "_blank" : undefined}
                rel={project.liveUrl ? "noopener noreferrer" : undefined}
                className={`relative flex min-h-72 items-center justify-center overflow-hidden border-b border-(--border-subtle) bg-[#050505] px-6 py-10 lg:min-h-120 lg:border-b-0 group/media ${index % 2 === 1 ? "lg:order-2 lg:border-l" : "lg:border-r"}`}
              >
                {/* Background Media (Video or Image) */}
                {project.videoUrl && !project.videoUrl.includes("loom.com") ? (
                  <video
                    src={project.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/media:scale-110"
                  />
                ) : project.coverImageUrl ? (
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/media:scale-110" 
                    style={{ backgroundImage: `url(${project.coverImageUrl})` }} 
                  />
                ) : (
                  <div className="bg-gradient-animated pointer-events-none absolute inset-0 -z-10 opacity-25" />
                )}

                {/* Glass Overlay - Always bright as per user request */}
                <div className="absolute inset-0 bg-black/15 z-0" />

                <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-8">
                  <div className="flex items-center justify-between gap-3 z-10">
                    {/* Only show symbols for non-video projects to simulate an interface; hide for real videos */}
                    {(!project.videoUrl || project.videoUrl.includes("loom.com")) ? (
                      <div className="flex gap-2 sm:gap-2.5">
                        <span className="h-3 w-3 rounded-full bg-[#FF5F57] sm:h-3.5 sm:w-3.5" />
                        <span className="h-3 w-3 rounded-full bg-[#FFBD2E] sm:h-3.5 sm:w-3.5" />
                        <span className="h-3 w-3 rounded-full bg-[#27C93F] sm:h-3.5 sm:w-3.5" />
                      </div>
                    ) : <div />}
                    <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/60 sm:text-[0.8rem] backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full">Project Preview</span>
                  </div>



                  {/* Central Play Indicator / Initials */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {(!project.videoUrl || project.videoUrl.includes("loom.com")) && !project.coverImageUrl ? (
                      <div className="relative flex items-center justify-center">
                        <span className="text-[10rem] font-black text-white/[0.04] uppercase tracking-tighter sm:text-[14rem] lg:text-[18rem] select-none animate-pulse-soft">
                          {project.title.substring(0, 2).toUpperCase()}
                        </span>
                        <div className="absolute flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-transform duration-300 group-hover/media:scale-110">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="ml-1.5 text-white">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-black/40 opacity-0 backdrop-blur-xl transition-all duration-500 scale-75 group-hover/media:opacity-100 group-hover/media:scale-100 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="ml-1.5 text-white">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar - Shown for static demos, hidden for real videos */}
                {(!project.videoUrl || project.videoUrl.includes("loom.com")) && (
                  <div className="absolute bottom-6 left-8 right-8 h-1 bg-white/10 rounded-full overflow-hidden z-10">
                    <div className="h-full w-1/3 bg-white/60 rounded-full" />
                  </div>
                )}
              </Link>

              <div className={`flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14 ${index % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                <p className="mb-4 flex items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-(--text-quaternary) sm:mb-6">
                  Project showcase
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.64rem] font-semibold tracking-widest text-(--text-secondary)">
                    Featured
                  </span>
                </p>

                <h2 className="mb-5 text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:mb-6">
                  {project.title}
                </h2>

                <p className="mb-8 text-[0.98rem] leading-7 text-(--text-secondary) sm:mb-10 sm:text-[1.05rem]">
                  {project.shortDescription}
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-5">
                  <Link href={`/projects/${project.slug}`} className="btn-primary w-full sm:w-auto">
                    <span>Watch Live Demo</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="ml-1 transition-transform group-hover:translate-x-1">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  {project.liveUrl && (
                    <Link 
                      href={project.liveUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost w-full sm:w-auto border-(--border-strong)"
                    >
                      Open Project
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
