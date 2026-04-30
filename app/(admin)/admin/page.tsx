import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [projectCount, certCount, expCount, messageCount] = await Promise.all([
    prisma.project.count(),
    prisma.certification.count(),
    prisma.experience.count(),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
  ]);

  const stats = [
    { label: "Projects",        value: projectCount, href: "/admin/projects",       highlight: false },
    { label: "Certifications",  value: certCount,    href: "/admin/certifications", highlight: false },
    { label: "Experience",      value: expCount,     href: "/admin/experience",     highlight: false },
    { label: "Unread Messages", value: messageCount, href: "/admin/messages",       highlight: messageCount > 0 },
  ];

  const quickLinks = [
    { label: "New Project",      href: "/admin/projects/new",       external: false },
    { label: "Edit Profile",     href: "/admin/profile",            external: false },
    { label: "Contact Settings", href: "/admin/contact",            external: false },
    { label: "Upload Media",     href: "/admin/media",              external: false },
    { label: "Manage Skills",    href: "/admin/skills/categories",  external: false },
    { label: "View Site",        href: "/",                         external: true  },
  ];

  return (
    <div className="animate-fade-up">
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Overview</h1>
          <p className="admin-page-subtitle">Welcome back. Here&apos;s your portfolio at a glance.</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up delay-100 mb-12">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className={`admin-stat-card group flex flex-col justify-between p-8 ${stat.highlight ? "admin-stat-card--alert" : ""}`}
          >
            <p
              className="mb-4 text-[2.5rem] font-semibold leading-none tracking-[-0.04em] transition-transform duration-300 group-hover:-translate-y-1"
              style={{ color: stat.highlight ? "#fca5a5" : "var(--foreground)" }}
            >
              {stat.value}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-[0.8125rem] font-medium text-[var(--text-secondary)]">{stat.label}</p>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-foreground transition-colors">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="admin-section animate-fade-up delay-200">
        <p className="admin-section-title">Quick Actions</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="admin-quick-link group"
            >
              <span className="font-medium">{link.label}</span>
              <span className={link.external ? "group-hover:translate-x-1 group-hover:-translate-y-1" : "group-hover:translate-x-1"}>
                {link.external ? "↗" : "→"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
