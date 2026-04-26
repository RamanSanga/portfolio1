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
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Certifications</h1>
      <p className="mt-1 text-sm text-zinc-400">Manage verification credentials and recruiter-facing proof of expertise.</p>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
        <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-zinc-400">Add Certification</h2>
        <form action={createCertificationAction} className="mt-4 grid gap-3 md:grid-cols-3">
          <input name="issuer" placeholder="Issuer" required className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="title" placeholder="Certification title" required className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="issueDate" type="date" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="credentialId" placeholder="Credential ID" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="credentialUrl" placeholder="Credential URL" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="sortOrder" type="number" min={0} defaultValue={0} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <label className="inline-flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" name="isFeatured" className="h-4 w-4 accent-zinc-200" />Featured</label>
          <button type="submit" className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white">Add Certification</button>
        </form>
      </section>

      <section className="mt-6 space-y-3">
        {certifications.map((item) => (
          <article key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
            <form action={updateCertificationAction.bind(null, item.id)} className="grid gap-3 md:grid-cols-3">
              <input name="issuer" defaultValue={item.issuer} required className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
              <input name="title" defaultValue={item.title} required className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
              <input name="issueDate" type="date" defaultValue={formatDateInput(item.issueDate)} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
              <input name="credentialId" defaultValue={item.credentialId ?? ""} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
              <input name="credentialUrl" defaultValue={item.credentialUrl ?? ""} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
              <input name="sortOrder" type="number" min={0} defaultValue={item.sortOrder} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
              <label className="inline-flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" name="isFeatured" defaultChecked={item.isFeatured} className="h-4 w-4 accent-zinc-200" />Featured</label>
              <button type="submit" className="rounded-md border border-zinc-700 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-300">Save</button>
            </form>
            <form action={deleteCertificationAction.bind(null, item.id)} className="mt-3">
              <button type="submit" className="rounded-md border border-red-900/70 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-red-300">Delete Certification</button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
