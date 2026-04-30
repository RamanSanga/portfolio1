import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { AdminLoginForm } from "@/components/forms/admin-login-form";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/admin/projects");
  }

  return (
    <div className="page-login-shell">
      <div className="w-full max-w-md">
        <div className="page-login-brand animate-fade-up">
          <p className="page-login-brand__eyebrow">Portfolio CMS</p>
          <h1 className="page-login-brand__title">Admin Sign In</h1>
          <p className="page-login-brand__copy">Use your admin credentials to access the CMS dashboard.</p>
        </div>

        <div className="page-login-card animate-fade-up delay-100">
          <AdminLoginForm />
          <div className="mt-6 border-t border-(--border-subtle) pt-6 text-center">
            <Link 
              href="/" 
              className="text-[0.8rem] font-medium text-(--text-secondary) transition-colors hover:text-white flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Return to Portfolio
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-[0.75rem] text-(--text-quaternary) uppercase tracking-widest opacity-50">
          Restricted access. Authorised personnel only.
        </p>
      </div>
    </div>
  );
}
