import { getServerSession } from "next-auth";
import { AdminSidebarLayout } from "@/components/admin/admin-sidebar-layout";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Login page renders inside the /admin route tree but without the sidebar shell.
  // Middleware already protects /admin routes (except /admin/login).
  if (!session?.user?.email) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)" }}>
        {children}
      </div>
    );
  }

  return (
    <AdminSidebarLayout userEmail={session.user.email}>
      {children}
    </AdminSidebarLayout>
  );
}
