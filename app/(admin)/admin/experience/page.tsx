import { createExperienceAction, deleteExperienceAction, updateExperienceAction } from "@/actions/experience";
import { prisma } from "@/lib/prisma";

function formatDateInput(date: Date | null) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export default async function AdminExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { startDate: "desc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Experience</h1>
      <p className="mt-1 text-sm text-zinc-400">Maintain professional timeline, achievements, and recruiter-facing context.</p>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
        <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-zinc-400">Add Experience</h2>
        <form action={createExperienceAction} className="mt-4 grid gap-3 md:grid-cols-3">
          <input name="organization" placeholder="Organization" required className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="role" placeholder="Role" required className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="context" placeholder="Context" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <textarea name="summary" placeholder="Summary" required rows={3} className="md:col-span-3 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="location" placeholder="Location" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="startDate" type="date" required className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="endDate" type="date" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="sortOrder" type="number" min={0} defaultValue={0} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <label className="inline-flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" name="featured" className="h-4 w-4 accent-zinc-200" />Featured</label>
          <button type="submit" className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white">Add Experience</button>
        </form>
      </section>

      <section className="mt-6 space-y-3">
        {experiences.map((item) => (
          <article key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
            <form action={updateExperienceAction.bind(null, item.id)} className="grid gap-3 md:grid-cols-3">
              <input name="organization" defaultValue={item.organization} required className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
              <input name="role" defaultValue={item.role} required className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
              <input name="context" defaultValue={item.context ?? ""} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
              <textarea name="summary" defaultValue={item.summary} required rows={3} className="md:col-span-3 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
              <input name="location" defaultValue={item.location ?? ""} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
              <input name="startDate" type="date" defaultValue={formatDateInput(item.startDate)} required className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
              <input name="endDate" type="date" defaultValue={formatDateInput(item.endDate)} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
              <input name="sortOrder" type="number" min={0} defaultValue={item.sortOrder} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
              <label className="inline-flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" name="featured" defaultChecked={item.featured} className="h-4 w-4 accent-zinc-200" />Featured</label>
              <button type="submit" className="rounded-md border border-zinc-700 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-300">Save</button>
            </form>
            <form action={deleteExperienceAction.bind(null, item.id)} className="mt-3">
              <button type="submit" className="rounded-md border border-red-900/70 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-red-300">Delete Experience</button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
