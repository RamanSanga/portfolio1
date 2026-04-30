import { updateResumeAssetAction, updateSiteProfileAction } from "@/actions/site-settings";
import { prisma } from "@/lib/prisma";

export default async function AdminProfilePage() {
  const [profile, resume] = await Promise.all([
    prisma.siteProfile.findUnique({ where: { singletonKey: "main" } }),
    prisma.resumeAsset.findFirst({ where: { isActive: true }, orderBy: { version: "desc" } }),
  ]);

  return (
    <div>
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Profile &amp; Hero</h1>
          <p className="admin-page-subtitle">Control the public hero/about narrative and active resume asset.</p>
        </div>
      </div>

      {/* Hero / About */}
      <div className="admin-section" style={{ marginBottom: "1.5rem" }}>
        <p className="admin-section-title">Hero / About</p>
        <form action={updateSiteProfileAction}>
          <div className="grid gap-4 md:grid-cols-2" style={{ marginBottom: "1rem" }}>
            <div>
              <label className="admin-field-label">Full Name</label>
              <input name="fullName" defaultValue={profile?.fullName ?? ""} placeholder="Your full name" required className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">Headline</label>
              <input name="headline" defaultValue={profile?.headline ?? ""} placeholder="e.g. Full-Stack Developer" required className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">Tagline</label>
              <input name="tagline" defaultValue={profile?.tagline ?? ""} placeholder="Short tagline" className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">Location</label>
              <input name="location" defaultValue={profile?.location ?? ""} placeholder="City, Country" className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">Education</label>
              <input name="education" defaultValue={profile?.education ?? ""} placeholder="Degree, University" className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">Profile Image URL</label>
              <input name="profileImageUrl" defaultValue={profile?.profileImageUrl ?? ""} placeholder="https://..." className="admin-input" />
            </div>
            <div className="md:col-span-2">
              <label className="admin-field-label">Cloudinary Public ID</label>
              <input name="profileImagePublicId" defaultValue={profile?.profileImagePublicId ?? ""} placeholder="portfolio-cms/avatar" className="admin-input" />
            </div>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label className="admin-field-label">About Summary</label>
            <textarea
              name="about"
              defaultValue={profile?.about ?? ""}
              required
              rows={5}
              className="admin-textarea"
              placeholder="Write a compelling about paragraph for the public hero section…"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="admin-btn-primary">Save Profile</button>
          </div>
        </form>
      </div>

      {/* Resume Asset */}
      <div className="admin-section">
        <p className="admin-section-title">Resume Asset</p>
        {resume && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              background: "var(--background)",
              border: "1px solid var(--border-subtle)",
              marginBottom: "1rem",
            }}
          >
            <span className="badge badge-success">Active</span>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{resume.label}</p>
          </div>
        )}
        <form action={updateResumeAssetAction}>
          <div className="grid gap-4 md:grid-cols-3" style={{ marginBottom: "1rem" }}>
            <div>
              <label className="admin-field-label">Label</label>
              <input name="label" defaultValue={resume?.label ?? "Primary Resume"} required className="admin-input" />
            </div>
            <div className="md:col-span-2">
              <label className="admin-field-label">File URL</label>
              <input name="fileUrl" defaultValue={resume?.fileUrl ?? ""} required placeholder="https://...pdf" className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">MIME Type</label>
              <input name="mimeType" defaultValue={resume?.mimeType ?? "application/pdf"} className="admin-input" />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="admin-btn-primary">Publish Resume</button>
          </div>
        </form>
      </div>
    </div>
  );
}
