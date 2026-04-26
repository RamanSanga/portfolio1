import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
};

export function Section({ id, title, subtitle, className, children }: SectionProps) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-6xl px-6 py-12 md:py-16", className)}>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-100 md:text-3xl">{title}</h2>
        {subtitle ? <p className="mt-2 max-w-3xl text-sm text-zinc-400 md:text-base">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
