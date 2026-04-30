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
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Experience</h1>
          <p className="admin-page-subtitle">Maintain professional timeline, achievements, and recruiter-facing context.</p>
        </div>
      </div>

      {/* Add form */}
      <div className="admin-section" style={{ marginBottom: "1.5rem" }}>
        <p className="admin-section-title">Add Experience</p>
        <form action={createExperienceAction}>
          <div className="grid gap-3 md:grid-cols-3" style={{ marginBottom: "0.75rem" }}>
            <div>
              <label className="admin-field-label">Organization</label>
              <input name="organization" placeholder="Company / Institution" required className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">Role</label>
              <input name="role" placeholder="Job title" required className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">Context</label>
              <input name="context" placeholder="e.g. Freelance, Internship" className="admin-input" />
            </div>
          </div>
          <div style={{ marginBottom: "0.75rem" }}>
            <label className="admin-field-label">Summary</label>
            <textarea name="summary" placeholder="Role highlights and achievements…" required rows={3} className="admin-textarea" />
          </div>
          <div className="grid gap-3 md:grid-cols-4" style={{ marginBottom: "0.75rem" }}>
            <div>
              <label className="admin-field-label">Location</label>
              <input name="location" placeholder="City, Country" className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">Start Date</label>
              <input name="startDate" type="date" required className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">End Date</label>
              <input name="endDate" type="date" className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">Sort Order</label>
              <input name="sortOrder" type="number" min={0} defaultValue={0} className="admin-input" />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
            <label className="admin-checkbox">
              <input type="checkbox" name="featured" />
              Featured
            </label>
            <button type="submit" className="admin-btn-primary">Add Experience</button>
          </div>
        </form>
      </div>

      {/* List */}
      {experiences.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">No experience entries</p>
          <p className="empty-state-desc">Add your first work experience above.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {experiences.map((item) => (
            <article key={item.id} className="admin-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--foreground)" }}>
                    {item.role}
                  </p>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)" }}>{item.organization}</p>
                </div>
                {item.featured && <span className="badge badge-info">Featured</span>}
              </div>
              <form action={updateExperienceAction.bind(null, item.id)}>
                <div className="grid gap-3 md:grid-cols-3" style={{ marginBottom: "0.75rem" }}>
                  <div>
                    <label className="admin-field-label">Organization</label>
                    <input name="organization" defaultValue={item.organization} required className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-field-label">Role</label>
                    <input name="role" defaultValue={item.role} required className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-field-label">Context</label>
                    <input name="context" defaultValue={item.context ?? ""} className="admin-input" />
                  </div>
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label className="admin-field-label">Summary</label>
                  <textarea name="summary" defaultValue={item.summary} required rows={3} className="admin-textarea" />
                </div>
                <div className="grid gap-3 md:grid-cols-4" style={{ marginBottom: "0.75rem" }}>
                  <div>
                    <label className="admin-field-label">Location</label>
                    <input name="location" defaultValue={item.location ?? ""} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-field-label">Start Date</label>
                    <input name="startDate" type="date" defaultValue={formatDateInput(item.startDate)} required className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-field-label">End Date</label>
                    <input name="endDate" type="date" defaultValue={formatDateInput(item.endDate)} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-field-label">Sort Order</label>
                    <input name="sortOrder" type="number" min={0} defaultValue={item.sortOrder} className="admin-input" />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                  <label className="admin-checkbox">
                    <input type="checkbox" name="featured" defaultChecked={item.featured} />
                    Featured
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <form action={deleteExperienceAction.bind(null, item.id)}>
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
