"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";

const adminNav = [
  { href: "/admin",                   label: "Overview",      icon: "◈" },
  { href: "/admin/projects",          label: "Projects",      icon: "⬡" },
  { href: "/admin/skills/categories", label: "Skills",        icon: "◎" },
  { href: "/admin/experience",        label: "Experience",    icon: "◷" },
  { href: "/admin/certifications",    label: "Certifications",icon: "◈" },
  { href: "/admin/profile",           label: "Profile",       icon: "◉" },
  { href: "/admin/contact",           label: "Contact",       icon: "◌" },
  { href: "/admin/messages",          label: "Messages",      icon: "◻" },
  { href: "/admin/media",             label: "Media",         icon: "▣" },
];

type AdminSidebarLayoutProps = {
  children: React.ReactNode;
  userEmail: string;
};

export function AdminSidebarLayout({ children, userEmail }: AdminSidebarLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="admin-shell">
      <div className="admin-layout mx-auto grid w-full max-w-360 lg:grid-cols-[240px_1fr]">
        <aside className="admin-sidebar hidden lg:flex lg:flex-col">
          <div className="admin-sidebar__brand">
            <p className="text-[0.64rem] font-bold uppercase tracking-[0.24em] text-(--text-quaternary)">Admin CMS</p>
            <p className="mt-2 truncate text-[0.78rem] text-(--text-tertiary)" title={userEmail}>
              {userEmail}
            </p>
          </div>

          <nav className="flex-1 p-3">
            <div className="flex flex-col gap-1">
              {adminNav.map((item) => {
                const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link key={item.href} href={item.href} className={`admin-nav-link${active ? " active" : ""}`}>
                    <span aria-hidden="true" className="text-[0.7rem] opacity-60">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="admin-sidebar__footer">
            <Link href="/" className="text-[0.75rem] text-(--text-quaternary) transition-colors hover:text-(--text-secondary)">
              ← View Site
            </Link>
            <AdminSignOutButton />
          </div>
        </aside>

        <div className="lg:hidden admin-topbar">
          <div className="flex h-14 items-center justify-between px-4">
            <p className="text-[0.64rem] font-bold uppercase tracking-[0.24em] text-(--text-quaternary)">Admin CMS</p>
            <AdminSignOutButton />
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none]">
            {adminNav.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap rounded-full border px-3 py-1.5 text-[0.72rem] transition-colors"
                  style={{
                    color: active ? "var(--foreground)" : "var(--text-tertiary)",
                    background: active ? "rgba(228, 210, 173, 0.08)" : "transparent",
                    borderColor: active ? "rgba(228, 210, 173, 0.18)" : "transparent",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
