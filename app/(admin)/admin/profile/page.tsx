import { updateResumeAssetAction, updateSiteProfileAction } from "@/actions/site-settings";
import { prisma } from "@/lib/prisma";

export default async function AdminProfilePage() {
  const [profile, resume] = await Promise.all([
    prisma.siteProfile.findUnique({ where: { singletonKey: "main" } }),
    prisma.resumeAsset.findFirst({ where: { isActive: true }, orderBy: { version: "desc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Profile & Hero</h1>
      <p className="mt-1 text-sm text-zinc-400">Control the public hero/about narrative and active resume asset.</p>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
        <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-zinc-400">Hero / About</h2>
        <form action={updateSiteProfileAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="fullName" defaultValue={profile?.fullName ?? ""} placeholder="Full Name" required className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="headline" defaultValue={profile?.headline ?? ""} placeholder="Headline" required className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="tagline" defaultValue={profile?.tagline ?? ""} placeholder="Tagline" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="location" defaultValue={profile?.location ?? ""} placeholder="Location" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="education" defaultValue={profile?.education ?? ""} placeholder="Education" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="profileImageUrl" defaultValue={profile?.profileImageUrl ?? ""} placeholder="Profile Image URL" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="profileImagePublicId" defaultValue={profile?.profileImagePublicId ?? ""} placeholder="Cloudinary Public ID" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <textarea name="about" defaultValue={profile?.about ?? ""} required rows={5} className="md:col-span-2 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" placeholder="About summary" />
          <button type="submit" className="w-fit rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white">Save Profile</button>
        </form>
      </section>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
        <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-zinc-400">Resume Asset</h2>
        <p className="mt-2 text-xs text-zinc-500">Active: {resume?.label ?? "No active resume"}</p>
        <form action={updateResumeAssetAction} className="mt-4 grid gap-3 md:grid-cols-3">
          <input name="label" defaultValue={resume?.label ?? "Primary Resume"} required className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="fileUrl" defaultValue={resume?.fileUrl ?? ""} required placeholder="https://...pdf" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input name="mimeType" defaultValue={resume?.mimeType ?? "application/pdf"} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <button type="submit" className="w-fit rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white">Publish Resume</button>
        </form>
      </section>
    </div>
  );
}
