import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
};

export function Section({ id, title, subtitle, className, children }: SectionProps) {
  const eyebrow = id ? id.replace(/-/g, " ") : "Portfolio";

  return (
    <section id={id} className={cn("section-shell premium-container", className)}>
      <div className="section-heading animate-fade-up">
        <div className="mb-4 flex items-center justify-center gap-4">
          <div className="h-px w-8 bg-white/10" />
          <p className="section-heading__eyebrow !m-0">{eyebrow}</p>
          <div className="h-px w-8 bg-white/10" />
        </div>
        <div className="relative inline-block">
          <h2 className="section-heading__title relative z-10">{title}</h2>
          <div className="beam-effect absolute -bottom-2 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
        {subtitle ? <p className="section-heading__copy mt-6">{subtitle}</p> : null}
      </div>

      {children}
    </section>
  );
}
