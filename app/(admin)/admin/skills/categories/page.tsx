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
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Skill Categories</h1>
          <p className="admin-page-subtitle">Create and organize skill buckets used across public and admin views.</p>
        </div>
      </div>

      {/* Add form */}
      <div className="admin-section" style={{ marginBottom: "1.5rem" }}>
        <p className="admin-section-title">Create Category</p>
        <form action={createSkillCategoryAction}>
          <div className="grid gap-3 md:grid-cols-3" style={{ marginBottom: "0.75rem" }}>
            <div>
              <label className="admin-field-label">Category Name</label>
              <input name="name" placeholder="e.g. Languages, Databases" required className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">Sort Order</label>
              <input name="sortOrder" type="number" min={0} defaultValue={0} className="admin-input" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <label className="admin-checkbox" style={{ marginBottom: "0.375rem" }}>
                <input type="checkbox" name="isVisible" defaultChecked />
                Visible on public site
              </label>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="admin-btn-primary">Add Category</button>
          </div>
        </form>
      </div>

      {/* List */}
      {categories.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">No categories yet</p>
          <p className="empty-state-desc">Create your first skill category above.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {categories.map((category) => (
            <article key={category.id} className="admin-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--foreground)" }}>
                    {category.name}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-quaternary)", marginTop: "0.125rem" }}>
                    {category._count.skills} skill{category._count.skills !== 1 ? "s" : ""}
                  </p>
                </div>
                {!category.isVisible && <span className="badge badge-warning">Hidden</span>}
              </div>
              <form action={updateSkillCategoryAction.bind(null, category.id)}>
                <div className="grid gap-3 md:grid-cols-4" style={{ marginBottom: "0.75rem" }}>
                  <div>
                    <label className="admin-field-label">Name</label>
                    <input name="name" defaultValue={category.name} required className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-field-label">Slug</label>
                    <input name="slug" defaultValue={category.slug} required className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-field-label">Sort Order</label>
                    <input name="sortOrder" type="number" min={0} defaultValue={category.sortOrder} className="admin-input" />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                    <label className="admin-checkbox">
                      <input type="checkbox" name="isVisible" defaultChecked={category.isVisible} />
                      Visible
                    </label>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                  <form action={deleteSkillCategoryAction.bind(null, category.id)}>
                    <button type="submit" className="admin-btn-danger">Delete</button>
                  </form>
                  <button type="submit" className="admin-btn-primary">Save</button>
                </div>
              </form>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
