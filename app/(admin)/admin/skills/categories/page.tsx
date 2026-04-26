import {
  createSkillCategoryAction,
  deleteSkillCategoryAction,
  updateSkillCategoryAction,
} from "@/actions/skills";
import { prisma } from "@/lib/prisma";

export default async function AdminSkillCategoriesPage() {
  const categories = await prisma.skillCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      _count: {
        select: { skills: true },
      },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Skill Categories</h1>
      <p className="mt-1 text-sm text-zinc-400">Create and organize skill buckets used across public and admin views.</p>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
        <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-zinc-400">Create Category</h2>
        <form action={createSkillCategoryAction} className="mt-4 grid gap-3 md:grid-cols-4">
          <input
            name="name"
            placeholder="Category name"
            required
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
            <input type="checkbox" name="isVisible" defaultChecked className="h-4 w-4 accent-zinc-200" />
            Visible
          </label>
          <button
            type="submit"
            className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white"
          >
            Add Category
          </button>
        </form>
      </section>

      <section className="mt-6 space-y-3">
        {categories.map((category) => (
          <article key={category.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
            <form action={updateSkillCategoryAction.bind(null, category.id)} className="grid gap-3 md:grid-cols-5">
              <input
                name="name"
                defaultValue={category.name}
                required
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
              <input
                name="slug"
                defaultValue={category.slug}
                required
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
              <input
                name="sortOrder"
                type="number"
                min={0}
                defaultValue={category.sortOrder}
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
              <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  name="isVisible"
                  defaultChecked={category.isVisible}
                  className="h-4 w-4 accent-zinc-200"
                />
                Visible
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="rounded-md border border-zinc-700 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-300"
                >
                  Save
                </button>
                <span className="text-xs text-zinc-500">{category._count.skills} skills</span>
              </div>
            </form>

            <form action={deleteSkillCategoryAction.bind(null, category.id)} className="mt-3">
              <button
                type="submit"
                className="rounded-md border border-red-900/70 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-red-300"
              >
                Delete Category
              </button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
