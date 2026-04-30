"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Certifications", href: "/certifications" },
  { label: "Contact", href: "/contact" },
  { label: "Admin", href: "/admin/login" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-shell">
      <header className="site-header animate-fade-in">
        <div className="premium-container site-header__inner">
          <Link href="/" className="site-brand" aria-label="Raman Sanga home">
            <span className="site-brand__mark" aria-hidden="true" />
            <span>Raman Sanga</span>
          </Link>

          <nav className="site-nav hidden lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link key={item.href} href={item.href} className="site-nav-link" aria-current={active ? "page" : undefined}>
                  {item.label}
                  {active ? <span className="site-nav-link__indicator" /> : null}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="site-mobile-toggle lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span className="sr-only">Toggle navigation</span>
            <span
              style={{
                display: "block",
                width: "1.2rem",
                height: "2px",
                borderRadius: "999px",
                background: "currentColor",
                transform: menuOpen ? "translateY(3px) rotate(45deg)" : "none",
                transition: "transform 220ms ease",
              }}
            />
            <span
              style={{
                display: "block",
                width: "1.2rem",
                height: "2px",
                borderRadius: "999px",
                background: "currentColor",
                transform: menuOpen ? "translateY(-3px) rotate(-45deg)" : "none",
                transition: "transform 220ms ease",
                marginTop: "0.3rem",
              }}
            />
          </button>
        </div>

        <div className={`site-mobile-panel lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          <nav className="premium-container flex flex-col gap-4 py-6" aria-label="Mobile navigation">
            {navItems.map((item, index) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="animate-fade-up"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    color: active ? "var(--foreground)" : "var(--text-secondary)",
                    fontSize: "1.05rem",
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-(--border-subtle)/80">
        <div className="premium-container py-10">
          <p className="text-center text-[0.78rem] uppercase tracking-[0.2em] text-(--text-tertiary)">
            © {new Date().getFullYear()} Raman Sanga. Driven by curiosity, defined by execution.
          </p>
        </div>
      </footer>
    </div>
  );
}
