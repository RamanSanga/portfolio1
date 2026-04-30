import { updateContactCtaAction, updateContactDetailsAction } from "@/actions/site-settings";
import { prisma } from "@/lib/prisma";

export default async function AdminContactPage() {
  const [profile, settings] = await Promise.all([
    prisma.siteProfile.findUnique({ where: { singletonKey: "main" } }),
    prisma.siteSetting.findMany({
      where: {
        key: {
          in: ["contact_cta_title", "contact_cta_description"],
        },
      },
    }),
  ]);

  const settingsMap = new Map(settings.map((item) => [item.key, item.value]));

  return (
    <div>
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Contact Settings</h1>
          <p className="admin-page-subtitle">Manage public contact channels and contact CTA copy.</p>
        </div>
      </div>

      {/* Contact details */}
      <div className="admin-section" style={{ marginBottom: "1.5rem" }}>
        <p className="admin-section-title">Contact Details</p>
        <form action={updateContactDetailsAction}>
          <div className="grid gap-4 md:grid-cols-2" style={{ marginBottom: "1rem" }}>
            <div>
              <label className="admin-field-label">Primary Email</label>
              <input name="primaryEmail" type="email" defaultValue={profile?.primaryEmail ?? ""} required placeholder="you@email.com" className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">University Email</label>
              <input name="universityEmail" type="email" defaultValue={profile?.universityEmail ?? ""} placeholder="university@edu.in" className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">Phone</label>
              <input name="phone" defaultValue={profile?.phone ?? ""} placeholder="+91 98765 43210" className="admin-input" />
            </div>
            <div>
              <label className="admin-field-label">Location</label>
              <input name="location" defaultValue={profile?.location ?? ""} placeholder="City, Country" className="admin-input" />
            </div>
            <div className="md:col-span-2">
              <label className="admin-field-label">Education</label>
              <input name="education" defaultValue={profile?.education ?? ""} placeholder="Degree, University" className="admin-input" />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="admin-btn-primary">Save Contact Details</button>
          </div>
        </form>
      </div>

      {/* CTA copy */}
      <div className="admin-section">
        <p className="admin-section-title">Contact CTA Copy</p>
        <form action={updateContactCtaAction}>
          <div style={{ marginBottom: "0.75rem" }}>
            <label className="admin-field-label">CTA Title</label>
            <input
              name="title"
              defaultValue={String(settingsMap.get("contact_cta_title") ?? "Let us build your next product.")}
              required
              className="admin-input"
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label className="admin-field-label">CTA Description</label>
            <textarea
              name="description"
              defaultValue={String(settingsMap.get("contact_cta_description") ?? "Open to full-stack and product engineering opportunities.")}
              required
              rows={3}
              className="admin-textarea"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="admin-btn-primary">Save CTA</button>
          </div>
        </form>
      </div>
    </div>
  );
}
