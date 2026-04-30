import { createSkillAction, deleteSkillAction, updateSkillAction } from "@/actions/skills";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

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
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Skills</h1>
          <p className="admin-page-subtitle">Manage skill items, feature flags, category assignment, and sort order.</p>
        </div>
        <Link href="/admin/skills/categories" className="admin-btn-secondary">
          Manage Categories →
        </Link>
      </div>

      {/* Add form */}
      <div className="admin-section" style={{ marginBottom: "1.5rem" }}>
        <p className="admin-section-title">Add Skill</p>
        <form action={createSkillAction}>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4" style={{ marginBottom: "0.75rem" }}>
            <div>
              <label className="admin-field-label">Skill Name</label>
              <input name="name" placeholder="e.g. TypeScript" required className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">Category</label>
              <select name="categoryId" required className="admin-select">
                <option value="">Select category…</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="admin-field-label">Proficiency (0–100)</label>
              <input name="proficiency" type="number" min={0} max={100} placeholder="80" className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">Sort Order</label>
              <input name="sortOrder" type="number" min={0} defaultValue={0} className="admin-input" />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label className="admin-checkbox">
              <input type="checkbox" name="isFeatured" />
              Featured
            </label>
            <button type="submit" className="admin-btn-primary">Add Skill</button>
          </div>
        </form>
      </div>

      {/* Skills list */}
      {skills.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">No skills yet</p>
          <p className="empty-state-desc">Add your first skill above.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {skills.map((skill) => (
            <article key={skill.id} className="admin-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--foreground)" }}>
                    {skill.name}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-quaternary)", marginTop: "0.125rem" }}>
                    {skill.category.name}
                    {skill.proficiency != null ? ` · ${skill.proficiency}%` : ""}
                  </p>
                </div>
                {skill.isFeatured && <span className="badge badge-info">Featured</span>}
              </div>
              <form action={updateSkillAction.bind(null, skill.id)}>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5" style={{ marginBottom: "0.75rem" }}>
                  <div>
                    <label className="admin-field-label">Name</label>
                    <input name="name" defaultValue={skill.name} required className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-field-label">Slug</label>
                    <input name="slug" defaultValue={skill.slug} required className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-field-label">Category</label>
                    <select name="categoryId" defaultValue={skill.categoryId} required className="admin-select">
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="admin-field-label">Proficiency</label>
                    <input name="proficiency" type="number" min={0} max={100} defaultValue={skill.proficiency ?? ""} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-field-label">Sort Order</label>
                    <input name="sortOrder" type="number" min={0} defaultValue={skill.sortOrder} className="admin-input" />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label className="admin-checkbox">
                    <input type="checkbox" name="isFeatured" defaultChecked={skill.isFeatured} />
                    Featured
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <form action={deleteSkillAction.bind(null, skill.id)}>
                      <button type="submit" className="admin-btn-danger">Delete</button>
                    </form>
                    <button type="submit" className="admin-btn-primary">Save</button>
                  </div>
                </div>
              </form>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
