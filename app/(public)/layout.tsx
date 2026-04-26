import Link from "next/link";

const navItems = [
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Certifications", href: "/certifications" },
  { label: "Contact", href: "/contact" },
  { label: "Admin", href: "/admin/login" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-30 border-b border-zinc-800/70 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-200">
            Raman Sanga
          </Link>
          <nav className="flex items-center gap-6 text-sm text-zinc-300">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-zinc-800/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
          <p>Product-focused portfolio CMS</p>
          <p>Built with Next.js, Prisma, PostgreSQL</p>
        </div>
      </footer>
    </div>
  );
}
