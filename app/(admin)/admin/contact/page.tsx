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
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Contact Settings</h1>
      <p className="mt-1 text-sm text-zinc-400">Manage public contact channels and contact CTA copy.</p>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
        <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-zinc-400">Contact Details</h2>
        <form action={updateContactDetailsAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="primaryEmail" type="email" defaultValue={profile?.primaryEmail ?? ""} required placeholder="Primary email" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="universityEmail" type="email" defaultValue={profile?.universityEmail ?? ""} placeholder="University email" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="phone" defaultValue={profile?.phone ?? ""} placeholder="Phone" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="location" defaultValue={profile?.location ?? ""} placeholder="Location" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="education" defaultValue={profile?.education ?? ""} placeholder="Education" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <button type="submit" className="w-fit rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white">Save Contact Details</button>
        </form>
      </section>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
        <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-zinc-400">Contact CTA</h2>
        <form action={updateContactCtaAction} className="mt-4 grid gap-3">
          <input name="title" defaultValue={String(settingsMap.get("contact_cta_title") ?? "Let us build your next product.")} required className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <textarea name="description" defaultValue={String(settingsMap.get("contact_cta_description") ?? "Open to full-stack and product engineering opportunities.")} required rows={3} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <button type="submit" className="w-fit rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white">Save CTA</button>
        </form>
      </section>
    </div>
  );
}
