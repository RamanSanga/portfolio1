import { createSkillAction, deleteSkillAction, updateSkillAction } from "@/actions/skills";
import { prisma } from "@/lib/prisma";

export default async function AdminSkillsPage() {
  const [categories, skills] = await Promise.all([
    prisma.skillCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      where: { isVisible: true },
    }),
    prisma.skill.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        category: {
          select: { name: true },
        },
      },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Skills</h1>
      <p className="mt-1 text-sm text-zinc-400">Manage skill items, feature flags, category assignment, and sort order.</p>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
        <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-zinc-400">Create Skill</h2>
        <form action={createSkillAction} className="mt-4 grid gap-3 md:grid-cols-6">
          <input
            name="name"
            placeholder="Skill name"
            required
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
          <select
            name="categoryId"
            required
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            name="proficiency"
            type="number"
            min={0}
            max={100}
            placeholder="0-100"
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
          <input
            name="sortOrder"
            type="number"
            min={0}
            defaultValue={0}
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
          <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" name="isFeatured" className="h-4 w-4 accent-zinc-200" />
            Featured
          </label>
          <button
            type="submit"
            className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white"
          >
            Add Skill
          </button>
        </form>
      </section>

      <section className="mt-6 space-y-3">
        {skills.map((skill) => (
          <article key={skill.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
            <form action={updateSkillAction.bind(null, skill.id)} className="grid gap-3 md:grid-cols-7">
              <input
                name="name"
                defaultValue={skill.name}
                required
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
              <input
                name="slug"
                defaultValue={skill.slug}
                required
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
              <select
                name="categoryId"
                defaultValue={skill.categoryId}
                required
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                name="proficiency"
                type="number"
                min={0}
                max={100}
                defaultValue={skill.proficiency ?? ""}
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
              <input
                name="sortOrder"
                type="number"
                min={0}
                defaultValue={skill.sortOrder}
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
              <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  name="isFeatured"
                  defaultChecked={skill.isFeatured}
                  className="h-4 w-4 accent-zinc-200"
                />
                Featured
              </label>
              <button
                type="submit"
                className="rounded-md border border-zinc-700 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-300"
              >
                Save
              </button>
            </form>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-zinc-500">Category: {skill.category.name}</p>
              <form action={deleteSkillAction.bind(null, skill.id)}>
                <button
                  type="submit"
                  className="rounded-md border border-red-900/70 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-red-300"
                >
                  Delete Skill
                </button>
              </form>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
