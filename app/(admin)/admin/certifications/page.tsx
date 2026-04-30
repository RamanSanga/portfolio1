import {
  createCertificationAction,
  deleteCertificationAction,
  updateCertificationAction,
} from "@/actions/certifications";
import { prisma } from "@/lib/prisma";

function formatDateInput(date: Date | null) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export default async function AdminCertificationsPage() {
  const certifications = await prisma.certification.findMany({
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Certifications</h1>
          <p className="admin-page-subtitle">Manage verification credentials and recruiter-facing proof of expertise.</p>
        </div>
      </div>

      {/* Add form */}
      <div className="admin-section" style={{ marginBottom: "1.5rem" }}>
        <p className="admin-section-title">Add Certification</p>
        <form action={createCertificationAction}>
          <div className="grid gap-3 md:grid-cols-2" style={{ marginBottom: "0.75rem" }}>
            <div>
              <label className="admin-field-label">Issuer</label>
              <input name="issuer" placeholder="e.g. Coursera, AWS, Google" required className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">Certification Title</label>
              <input name="title" placeholder="Full certification name" required className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">Issue Date</label>
              <input name="issueDate" type="date" className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">Credential ID</label>
              <input name="credentialId" placeholder="Optional credential ID" className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">Credential URL</label>
              <input name="credentialUrl" placeholder="https://..." className="admin-input" />
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
            <button type="submit" className="admin-btn-primary">Add Certification</button>
          </div>
        </form>
      </div>

      {/* List */}
      {certifications.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">No certifications yet</p>
          <p className="empty-state-desc">Add your first certification above.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {certifications.map((item) => (
            <article key={item.id} className="admin-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <p style={{ fontSize: "0.6875rem", color: "var(--text-quaternary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.125rem" }}>
                    {item.issuer}
                  </p>
                  <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--foreground)" }}>
                    {item.title}
                  </p>
                </div>
                {item.isFeatured && <span className="badge badge-info">Featured</span>}
              </div>
              <form action={updateCertificationAction.bind(null, item.id)}>
                <div className="grid gap-3 md:grid-cols-2" style={{ marginBottom: "0.75rem" }}>
                  <div>
                    <label className="admin-field-label">Issuer</label>
                    <input name="issuer" defaultValue={item.issuer} required className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-field-label">Title</label>
                    <input name="title" defaultValue={item.title} required className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-field-label">Issue Date</label>
                    <input name="issueDate" type="date" defaultValue={formatDateInput(item.issueDate)} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-field-label">Credential ID</label>
                    <input name="credentialId" defaultValue={item.credentialId ?? ""} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-field-label">Credential URL</label>
                    <input name="credentialUrl" defaultValue={item.credentialUrl ?? ""} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-field-label">Sort Order</label>
                    <input name="sortOrder" type="number" min={0} defaultValue={item.sortOrder} className="admin-input" />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label className="admin-checkbox">
                    <input type="checkbox" name="isFeatured" defaultChecked={item.isFeatured} />
                    Featured
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <form action={deleteCertificationAction.bind(null, item.id)}>
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
