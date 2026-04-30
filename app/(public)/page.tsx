import Link from "next/link";
import { Section } from "@/components/public/section";
import { getPublicHomeData } from "@/lib/queries/public";
import { HeroBackgroundClient as HeroBackground } from "@/components/public/hero-background.client";
import { MagneticWrapper } from "@/components/public/magnetic-wrapper";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import { TiltWrapper } from "@/components/public/tilt-wrapper";

export default async function HomePage() {
  const data = await getPublicHomeData();
  
  const projectTitles = data.featuredProjects?.map(p => p.title) || [];
  const allSkills = data.categories?.flatMap(c => c.skills?.map(s => s.name) || []) || [];

  return (
    <div className="bg-background pb-16">
      <section className="hero-shell relative flex min-h-0 items-center border-b border-(--border-subtle) py-10 sm:py-12 md:min-h-[70dvh] md:py-16 lg:min-h-[85dvh] lg:py-24 overflow-hidden">
        <HeroBackground projectTitles={projectTitles} skills={allSkills} />
        <div className="scanline" />

        <div className="premium-container relative z-10 w-full">
          <div className="flex w-full max-w-2xl flex-col items-center text-center lg:max-w-4xl lg:items-start lg:text-left">
            <div className="animate-fade-up">
              {/* Personalized Portfolio Badge */}
              <div className="mb-6 hidden items-center gap-4 sm:flex md:mb-10">
                <div className="h-px w-12 bg-white/30" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-[0.5em] text-white/40">
                  Continuous Evolution through Research & Engineering
                </span>
              </div>

              <div className="relative mb-12 sm:mb-16">
                <div className="aura-blob -left-20 -top-20 opacity-60" />
                <div className="aura-blob -right-20 bottom-0 opacity-40 [animation-delay:5s]" />
                
                <div className="flex items-center gap-2.5">
                  <div className="h-0.5 w-8 bg-white/40" />
                  <span className="text-[11px] font-mono uppercase tracking-[0.4em] text-white/40">Introduction_Sequence</span>
                </div>
              </div>
 
              <div className="relative mb-6 lg:mb-10">
                <h1 className="text-[clamp(2.2rem,12vw,7.5rem)] font-bold leading-[0.95] tracking-tighter text-white sm:leading-[0.85]">
                  {(data.profile?.fullName ?? "Developer").split("").map((char, i) => (
                    <span 
                      key={i} 
                      className="animate-split-reveal opacity-0" 
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </h1>
              </div>

              <div className="animate-fade-up delay-200 mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:gap-10">
                <p className="max-w-xl text-[1rem] font-light leading-relaxed text-white/60 sm:text-[clamp(1.05rem,1.8vw,1.5rem)]">
                  {data.profile?.headline}
                </p>
                <div className="hidden md:block h-14 w-px bg-white/10" />
                <div className="flex flex-col gap-1.5 text-left">
                  <span className="text-[11px] font-mono text-white/30 uppercase tracking-[0.2em] animate-pulse-soft">Learning_&_Exploration</span>
                  <span className="text-[14px] font-semibold text-white/80">Distributed Architectures / AI Orchestration / High-Performance Design</span>
                </div>
              </div>

              <div className="animate-fade-up delay-300 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link 
                  href="/projects" 
                  className="w-full sm:w-auto px-8 py-3.5 sm:px-10 sm:py-4 bg-zinc-900 text-white text-[12px] sm:text-[13px] font-bold tracking-[0.2em] uppercase border border-zinc-800 transition-all hover:bg-zinc-800 text-center"
                >
                  Explore_Work
                </Link>
                <Link 
                  href="/contact" 
                  className="w-full sm:w-auto px-8 py-3.5 sm:px-10 sm:py-4 border border-white/10  bg-zinc-900 backdrop-blur-md text-white/70 text-[12px] sm:text-[13px] font-bold tracking-[0.2em] uppercase transition-all hover:bg-white/5 hover:text-white text-center"
                >
                  Get_In_Touch
                </Link>

                {data.resume?.fileUrl && (
                  <Link 
                    href={data.resume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-3.5 sm:px-10 sm:py-4 border border-white/5 bg-white/5 text-white/40 text-[12px] sm:text-[13px] font-bold tracking-[0.2em] uppercase transition-all hover:bg-white/10 hover:text-white flex items-center justify-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15L12 3M12 15L8 11M12 15L16 11M2 17L2 19C2 20.1046 2.89543 21 4 21L20 21C21.1046 21 22 20.1046 22 19L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Resume
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section id="projects" title="Featured Work" subtitle="Highlighting my most impactful recent projects.">
        <div className="flex flex-col gap-[clamp(3.5rem,8vw,10rem)]">
          {data.featuredProjects.map((project, index) => (
            <ScrollReveal key={project.id} delay={index * 100}>
              <TiltWrapper>
                <article className="page-card glass-reflection-effect group overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-2">
                <Link
                  href={project.liveUrl || `/projects/${project.slug}`}
                  target={project.liveUrl ? "_blank" : undefined}
                  rel={project.liveUrl ? "noopener noreferrer" : undefined}
                  className={`relative block min-h-70 border-b border-(--border-subtle) bg-[#050505] sm:min-h-90 lg:min-h-112.5 lg:border-b-0 overflow-hidden group/media ${index % 2 === 0 ? "lg:border-r" : "lg:border-l"} ${index % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}
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
                      <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/60 sm:text-[0.8rem] backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full">Live Demo</span>
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

                  {/* Progress Bar (Visual Polish like the screenshot) - Shown for static demos, hidden for real videos */}
                  {(!project.videoUrl || project.videoUrl.includes("loom.com")) && (
                    <div className="absolute bottom-6 left-8 right-8 h-1 bg-white/10 rounded-full overflow-hidden z-10">
                      <div className="h-full w-1/3 bg-white/60 rounded-full" />
                    </div>
                  )}
                </Link>

                <div className={`flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-[10%] lg:py-16 ${index % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                  <p className="mb-4 flex items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-(--text-quaternary) sm:mb-6">
                    Project Showcase
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.64rem] font-semibold tracking-widest text-(--text-secondary)">Featured</span>
                  </p>
                  <h3 className="mb-5 text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground sm:mb-8">
                    {project.title}
                  </h3>
                  <p className="mb-8 text-[0.98rem] leading-7 text-(--text-secondary) sm:mb-10 sm:text-[1.125rem]">
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
            </TiltWrapper>
          </ScrollReveal>
        ))}
        </div>

        <div className="mt-12 text-center animate-fade-up delay-200 sm:mt-16">
          <Link href="/projects" className="btn-ghost border-(--border-strong)">
            View All Projects
          </Link>
        </div>
      </Section>

      <div className="premium-container border-t border-(--border-subtle) py-16 md:grid md:grid-cols-2 md:gap-16 lg:py-24">
        <div className="animate-fade-up delay-100">
          <h2 className="mb-8 text-[1.35rem] font-semibold tracking-[-0.02em] text-foreground sm:mb-10 sm:text-[1.75rem]">
            Career Track
          </h2>
          <div className="flex flex-col gap-8 sm:gap-10">
            {data.experience.slice(0, 3).map((item) => (
              <div key={item.id} className="relative pl-7 sm:pl-8">
                <div className="absolute left-0 top-2 -bottom-10 w-px bg-(--border-subtle)" />
                <div className="absolute -left-0.75 top-2 h-1.75 w-1.75 rounded-full bg-foreground shadow-[0_0_10px_rgba(255,255,255,0.5)]" />

                <h3 className="text-[1.1rem] font-medium tracking-[-0.01em] text-foreground sm:text-[1.25rem]">{item.role}</h3>
                <p className="mt-1 text-[0.9rem] text-(--text-secondary) sm:text-[0.9375rem]">{item.organization}</p>
                <p className="mt-3 text-[0.85rem] leading-6 text-(--text-tertiary) sm:mt-3.5 sm:text-[0.875rem] sm:leading-7">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-up delay-200 mt-14 md:mt-0 overflow-hidden">
          <h2 className="mb-8 text-[1.35rem] font-semibold tracking-[-0.02em] text-foreground sm:mb-10 sm:text-[1.75rem]">
            Technical Arsenal
          </h2>
          
          <div className="relative flex flex-col gap-6">
            {/* First Marquee - Moving Left */}
            <div className="group relative flex overflow-hidden py-3 hover:pause-on-hover">
              <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around gap-12 whitespace-nowrap px-6">
                {data.categories.flatMap(c => c.skills).filter((_, i) => i % 3 === 0).map((skill, i) => (
                  <div key={`${skill.name}-row1-${i}`} className="flex items-center gap-3 grayscale opacity-40 transition-all hover:grayscale-0 hover:opacity-100">
                    <img 
                      src={`https://skillicons.dev/icons?i=${skill.name.toLowerCase().replace(".js", "").replace(" ", "").replace("#", "sharp").replace("++", "cpp")}`} 
                      alt={skill.name} 
                      className="h-10 w-10 sm:h-12 sm:w-12"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="text-[14px] font-mono font-bold tracking-widest text-white/40">{skill.name.toUpperCase()}</span>
                  </div>
                ))}
              </div>
              <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around gap-12 whitespace-nowrap px-6" aria-hidden="true">
                {data.categories.flatMap(c => c.skills).filter((_, i) => i % 3 === 0).map((skill, i) => (
                  <div key={`${skill.name}-row1-dup-${i}`} className="flex items-center gap-3 grayscale opacity-40 transition-all hover:grayscale-0 hover:opacity-100">
                    <img 
                      src={`https://skillicons.dev/icons?i=${skill.name.toLowerCase().replace(".js", "").replace(" ", "").replace("#", "sharp").replace("++", "cpp")}`} 
                      alt={skill.name} 
                      className="h-10 w-10 sm:h-12 sm:w-12"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="text-[14px] font-mono font-bold tracking-widest text-white/40">{skill.name.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Second Marquee - Moving Right */}
            <div className="group relative flex overflow-hidden py-3 hover:pause-on-hover">
              <div className="animate-marquee-reverse flex min-w-full shrink-0 items-center justify-around gap-12 whitespace-nowrap px-6">
                {data.categories.flatMap(c => c.skills).filter((_, i) => i % 3 === 1).map((skill, i) => (
                  <div key={`${skill.name}-row2-${i}`} className="flex items-center gap-3 grayscale opacity-40 transition-all hover:grayscale-0 hover:opacity-100">
                    <img 
                      src={`https://skillicons.dev/icons?i=${skill.name.toLowerCase().replace(".js", "").replace(" ", "").replace("#", "sharp").replace("++", "cpp")}`} 
                      alt={skill.name} 
                      className="h-10 w-10 sm:h-12 sm:w-12"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="text-[14px] font-mono font-bold tracking-widest text-white/40">{skill.name.toUpperCase()}</span>
                  </div>
                ))}
              </div>
              <div className="animate-marquee-reverse flex min-w-full shrink-0 items-center justify-around gap-12 whitespace-nowrap px-6" aria-hidden="true">
                {data.categories.flatMap(c => c.skills).filter((_, i) => i % 3 === 1).map((skill, i) => (
                  <div key={`${skill.name}-row2-dup-${i}`} className="flex items-center gap-3 grayscale opacity-40 transition-all hover:grayscale-0 hover:opacity-100">
                    <img 
                      src={`https://skillicons.dev/icons?i=${skill.name.toLowerCase().replace(".js", "").replace(" ", "").replace("#", "sharp").replace("++", "cpp")}`} 
                      alt={skill.name} 
                      className="h-10 w-10 sm:h-12 sm:w-12"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="text-[14px] font-mono font-bold tracking-widest text-white/40">{skill.name.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Third Marquee - Moving Left */}
            <div className="group relative flex overflow-hidden py-3 hover:pause-on-hover">
              <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around gap-12 whitespace-nowrap px-6">
                {data.categories.flatMap(c => c.skills).filter((_, i) => i % 3 === 2).map((skill, i) => (
                  <div key={`${skill.name}-row3-${i}`} className="flex items-center gap-3 grayscale opacity-40 transition-all hover:grayscale-0 hover:opacity-100">
                    <img 
                      src={`https://skillicons.dev/icons?i=${skill.name.toLowerCase().replace(".js", "").replace(" ", "").replace("#", "sharp").replace("++", "cpp")}`} 
                      alt={skill.name} 
                      className="h-10 w-10 sm:h-12 sm:w-12"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="text-[14px] font-mono font-bold tracking-widest text-white/40">{skill.name.toUpperCase()}</span>
                  </div>
                ))}
              </div>
              <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around gap-12 whitespace-nowrap px-6" aria-hidden="true">
                {data.categories.flatMap(c => c.skills).filter((_, i) => i % 3 === 2).map((skill, i) => (
                  <div key={`${skill.name}-row3-dup-${i}`} className="flex items-center gap-3 grayscale opacity-40 transition-all hover:grayscale-0 hover:opacity-100">
                    <img 
                      src={`https://skillicons.dev/icons?i=${skill.name.toLowerCase().replace(".js", "").replace(" ", "").replace("#", "sharp").replace("++", "cpp")}`} 
                      alt={skill.name} 
                      className="h-10 w-10 sm:h-12 sm:w-12"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="text-[14px] font-mono font-bold tracking-widest text-white/40">{skill.name.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Gradient Mask for fading out on edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-(--background) to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-(--background) to-transparent z-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
