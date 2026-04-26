import Link from "next/link";
import { Section } from "@/components/public/section";
import { getPublicHomeData } from "@/lib/queries/public";

export default async function HomePage() {
  const data = await getPublicHomeData();

  return (
    <div className="pb-8">
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.35fr_0.65fr] md:py-24">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">Available for impactful product work</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-6xl">
            {data.profile?.fullName ?? "Portfolio"}
          </h1>
          <p className="mt-3 text-lg text-zinc-300 md:text-xl">{data.profile?.headline}</p>
          <p className="mt-5 max-w-2xl leading-7 text-zinc-400">{data.profile?.about}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="rounded-md bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-white"
            >
              View Projects
            </Link>
            <Link
              href={data.resume?.fileUrl ?? "#"}
              className="rounded-md border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-zinc-500"
            >
              Resume
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">Contact</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{data.contactCtaDescription}</p>
          <div className="mt-4 space-y-3 text-sm text-zinc-300">
            <p>{data.profile?.primaryEmail ?? "-"}</p>
            <p>{data.profile?.phone ?? "-"}</p>
            <p>{data.profile?.location ?? "-"}</p>
          </div>
        </div>
      </section>

      <Section
        id="projects"
        title="Featured Projects"
        subtitle="Selected work with product, architecture, and delivery focus."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {data.featuredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-700"
            >
              <p className="text-lg font-medium text-zinc-100">{project.title}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{project.shortDescription}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.16em] text-zinc-500 transition group-hover:text-zinc-300">
                View Case Study
              </p>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="skills" title="Skills" subtitle="Depth grouped by domain, not a keyword wall.">
        <div className="grid gap-4 md:grid-cols-2">
          {data.categories.map((category) => (
            <article key={category.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <h3 className="text-base font-medium text-zinc-100">{category.name}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {category.skills.map((skill) => skill.name).join(" • ")}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Experience" subtitle="Execution in real delivery and competitive builds.">
        <div className="space-y-4">
          {data.experience.map((item) => (
            <article key={item.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-medium text-zinc-100">
                  {item.role} · {item.organization}
                </h3>
                <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">{item.context}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{item.summary}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Certifications" subtitle="Validated technical learning pathways.">
        <div className="grid gap-4 md:grid-cols-2">
          {data.certifications.map((certification) => (
            <article key={certification.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <p className="text-sm uppercase tracking-[0.16em] text-zinc-500">{certification.issuer}</p>
              <h3 className="mt-2 text-base font-medium text-zinc-100">{certification.title}</h3>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
