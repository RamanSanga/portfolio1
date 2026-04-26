import Link from "next/link";
import { getServerSession } from "next-auth";
import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const adminNav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills/categories", label: "Skills" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/certifications", label: "Certifications" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/media", label: "Media" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // The login page is inside the /admin route tree, so redirecting here can create a loop.
  // Middleware already protects /admin routes (except /admin/login), so render login content directly when signed out.
  if (!session?.user?.email) {
    return <div className="min-h-screen bg-zinc-950 text-zinc-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[230px_1fr]">
        <aside className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Admin CMS</p>
            <AdminSignOutButton />
          </div>
          <p className="mb-4 text-xs text-zinc-400">Signed in as {session.user.email}</p>
          <nav className="space-y-1">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800/70 hover:text-zinc-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">{children}</section>
      </div>
    </div>
  );
}
